from rest_framework import generics, pagination, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.db import IntegrityError
from . import serializers, models
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import *
from .serializers import *

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            data = {
                'access': response.data['access'],
                'refresh': response.data['refresh']
            }
            return Response(data)
        else:
            data = {
                'success': False,
                'message': 'Invalid username or password. Please try again!'
            }
            return Response(data, status=response.status_code)

class AdminList(generics.ListCreateAPIView):
    queryset = models.Admin.objects.all()
    serializer_class = serializers.AdminSerializer

class AdminDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Admin.objects.all()
    serializer_class = serializers.AdminDetailSerializer

class BookList(generics.ListCreateAPIView):
    queryset = models.Book.objects.all()
    serializer_class = serializers.BookListSerializer
    pagination_class = pagination.PageNumberPagination

    def get_queryset(self):
        qs = super().get_queryset()
        category_id = self.request.GET.get('category')
        if category_id:
            try:
                category = models.BookCategory.objects.get(id=category_id)
                qs = qs.filter(category=category)
            except models.BookCategory.DoesNotExist:
                qs = qs.none()
        if 'fetch_limit' in self.request.GET:
            limit = int(self.request.GET['fetch_limit'])
            qs = qs[:limit]
        return qs

class TagBookList(generics.ListCreateAPIView):
    queryset = models.Book.objects.all()
    serializer_class = serializers.BookListSerializer
    pagination_class = pagination.PageNumberPagination

    def get_queryset(self):
        qs = super().get_queryset()
        tag = self.kwargs['tag']
        qs = qs.filter(tags__icontains=tag)
        return qs

class BookDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Book.objects.all()
    serializer_class = serializers.BookDetailSerializer

class CustomerList(generics.ListCreateAPIView):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.CustomerSerializer

class CustomerDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.CustomerDetailSerializer

class OrderList(generics.ListCreateAPIView):
    queryset = models.Order.objects.all()
    serializer_class = serializers.OrderSerializer

class OrderDetail(generics.RetrieveAPIView):
    queryset = models.Order.objects.all()
    serializer_class = serializers.OrderSerializer

class OrderItem(generics.ListAPIView):
    queryset = models.OrderItems.objects.all()
    serializer_class = serializers.OrderItemSerializer

class CustomerAddressViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CustomerAddressSerializer
    queryset = models.CustomerAddress.objects.all().order_by('id')

class BookRatingViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.BookRatingSerializer
    queryset = models.BookRating.objects.all()

class BookRatingsList(APIView):
    def get(self, request, book_id, format=None):
        try:
            ratings = BookRating.objects.filter(book_id=book_id)
            serializer = BookRatingSerializer(ratings, many=True)
            return Response(serializer.data)
        except BookRating.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class CategoryList(generics.ListCreateAPIView):
    queryset = models.BookCategory.objects.all()
    serializer_class = serializers.CategorySerializer
    pagination_class = pagination.PageNumberPagination

    def get_queryset(self):
        qs = super().get_queryset()
        if 'fetch_limit' in self.request.GET:
            limit = int(self.request.GET['fetch_limit'])
            qs = qs[:limit]
        return qs

class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.BookCategory.objects.all()
    serializer_class = serializers.CategoryDetailSerializer
    pagination_class = pagination.PageNumberPagination

class CustomerLogin(APIView):
    @csrf_exempt
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request):
        token_view = MyTokenObtainPairView.as_view()
        return token_view(request)

class CustomerRegister(APIView):
    @csrf_exempt
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request):
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        username = request.POST.get('username')
        password = request.POST.get('password')
        email = request.POST.get('email')
        try: 
            if User.objects.filter(username=username).exists():
                message = {
                    'success': False,
                    'message': 'Username already exists.'
                }
                return JsonResponse(message)

            user = User.objects.create_user(
                username=username,
                password=password,
                email=email,
                first_name=first_name,
                last_name=last_name
            )

            if user:
                customer = models.Customer.objects.create(user=user)
                message = {
                    'success': True,
                    'user': user.id,
                    'customer': customer.id,
                    'message': "You are now registered! Log in."
                }
            else:
                message = {
                    'success': False,
                    'message': 'Something went wrong!'
                }
            return JsonResponse(message)
        except IntegrityError:
            message = {
                'success': False,
                'message': 'Username already exists!'
            }
            return JsonResponse(message)
        
class ViewCart(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        if request.user.is_authenticated:
            orders = Order.objects.filter(customer__user=request.user, is_ordered=False)
            order_items_list = []

            for order in orders:
                order_items = OrderItems.objects.filter(order=order)
                order_items_list.extend(order_items)
            serializer = OrderItemSerializer(order_items_list, many=True)
            return Response(serializer.data)  
        else:
            return Response({"detail": "User is not authenticated."}, status=401)

class AddToCart(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, book_id):
        try:
            quantity = request.data.get('quantity', 1)
            book = Book.objects.get(id=book_id)
            customer = request.user

            if request.user.is_authenticated:
                customer, created = Customer.objects.get_or_create(user=customer)
                order, created = Order.objects.get_or_create(customer=customer, is_ordered=False)

                order_item, created = OrderItems.objects.get_or_create(order=order, book=book)
                if not created:
                    order_item.quantity += int(quantity)
                    order_item.save()
                else:
                    order_item.quantity = int(quantity)
                    order_item.save()

                serializer = OrderItemSerializer(order_item)
                return JsonResponse(serializer.data)
            else:
                return JsonResponse({'success': False, 'message': 'User is not authenticated'}, status=401)
        except Book.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Book does not exist'}, status=404)

class DeleteFromCart(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_item_id): 
        try:
            order_item = OrderItems.objects.get(id=order_item_id) 
            order_item.delete()
            return JsonResponse({'success': True, 'message': 'Item deleted from cart successfully'})
        except OrderItems.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Item does not exist in the cart'}, status=404)

class RemoveFromCart(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, order_item_id): 
        try:
            order_item = OrderItems.objects.get(id=order_item_id) 
            if order_item.quantity > 1:
                order_item.quantity -= 1
                order_item.save()
            else:
                order_item.delete()
            return JsonResponse({'success': True, 'message': 'Quantity removed from cart successfully'})
        except OrderItems.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Item does not exist in the cart'}, status=404)

class Checkout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            customer = request.user.customer_set.first()  
            order = Order.objects.get(customer=customer, is_ordered=False)
            data = request.data

            order.shipping_method = data.get('shipping_method')
            order.payment_method = data.get('payment_method')
            order.total_price = data.get('total_price')
            order.phone_number = data.get('phone_number')

            address_data = data.get('customer_address')
            print(address_data)
            if 'address_id' in address_data:
                order.customer_address_id = address_data['address_id']
            else:
                customer_address = CustomerAddress.objects.create(
                    customer_id=customer.id,
                    street=address_data['street'],
                    House=address_data['House'],
                    city=address_data['city'],
                    region=address_data['region'],
                    zip_code=address_data['zip_code']
                )
                order.customer_address = customer_address

            print(order.customer_address)
            order.is_ordered = True
            order.save()

            message = {
                'success': True,
                'message': 'Checkout successful',
                'order_id': order.id
            }
            return Response(message)
        except Order.DoesNotExist:
            message = {
                'success': False,
                'message': 'No active order found for the user'
            }
            return Response(message, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            message = {
                'success': False,
                'message': str(e)
            }
            return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CustomerDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        try:
            customer = Customer.objects.get(user=request.user)
            serializer = CustomerDetailSerializer(customer)
            return Response(serializer.data)
        except Customer.DoesNotExist:
            return Response({"detail": "Customer not found."}, status=404)
        
    def put(self, request, format=None):
        try:
            customer = Customer.objects.get(user=request.user)
            print("Received data:", request.data) 
            serializer = CustomerDetailSerializer(customer, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Customer.DoesNotExist:
            return Response({"detail": "Customer not found."}, status=status.HTTP_404_NOT_FOUND)

class CustomerOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
            customer = Customer.objects.get(user=request.user)
            orders = customer.customer_orders.filter(is_ordered=True)
            serializer = OrderDetailSerializer(orders, many=True)
            return Response(serializer.data)
        except Customer.DoesNotExist:
            return Response({"message": "Orders not found."}, status=404)

class CustomerAddAddressView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            customer = Customer.objects.get(user=request.user)

            address_data = {
                'customer': customer.id,
                'street': request.data.get('street', ''),
                'House': request.data.get('House', ''),
                'city': request.data.get('city', ''),
                'region': request.data.get('region', ''),
                'zip_code': request.data.get('zip_code', ''),
                'default_address': request.data.get('default_address', False)  
            }

            serializer = CustomerAddressSerializer(data=address_data)
            if serializer.is_valid():
                customer_address = serializer.save()

                return Response({
                    'success': True,
                    'message': 'Address added successfully',
                    'customer_address': serializer.data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CustomerDeleteAddressView(APIView):
    def delete(self, request, address_id):
        try:
            address = CustomerAddress.objects.get(id=address_id)
            address.delete()
            return Response({'success': True, 'message': 'Address deleted successfully'})
        except CustomerAddress.DoesNotExist:
            return Response({'success': False, 'message': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
