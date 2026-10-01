import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SidebarTableProvider } from './context/SidebarTableContext';
import { PublicLayout } from './components/PublicLayout';
import { DashboardLayout } from './components/DashboardLayout';
import { RoleDashboardLayout } from './components/RoleDashboardLayout';
import { ProtectedRoute, RoleRoute } from './components/ProtectedRoute';
import { ownerLinks, vetLinks, shelterLinks, adminLinks } from './components/dashboardLinks';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Veterinarians from './pages/public/Veterinarians';
import VeterinarianDetail from './pages/public/VeterinarianDetail';
import Products from './pages/public/Products';
import ProductDetail from './pages/public/ProductDetail';
import CareResources from './pages/public/CareResources';
import ArticleDetail from './pages/public/ArticleDetail';
import FaqPage from './pages/public/FaqPage';
import Adoption from './pages/public/Adoption';
import AdoptionDetail from './pages/public/AdoptionDetail';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

import Notifications from './pages/shared/Notifications';
import ProfileSettings from './pages/shared/ProfileSettings';
import Cart from './pages/shared/Cart';

import OwnerDashboard from './pages/owner/OwnerDashboard';
import PetsList from './pages/owner/PetsList';
import PetForm from './pages/owner/PetForm';
import PetDetail from './pages/owner/PetDetail';
import OwnerAppointments from './pages/owner/OwnerAppointments';
import BookAppointment from './pages/owner/BookAppointment';
import OwnerOrders from './pages/owner/OwnerOrders';

import VetDashboard from './pages/vet/VetDashboard';
import VetAppointments from './pages/vet/VetAppointments';
import VetPatients from './pages/vet/VetPatients';
import VetPetRecords from './pages/vet/VetPetRecords';
import VetProfile from './pages/vet/VetProfile';

import ShelterDashboard from './pages/shelter/ShelterDashboard';
import ShelterListings from './pages/shelter/ShelterListings';
import ListingForm from './pages/shelter/ListingForm';
import ListingManage from './pages/shelter/ListingManage';
import ShelterProfile from './pages/shelter/ShelterProfile';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPets from './pages/admin/AdminPets';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminAdoptions from './pages/admin/AdminAdoptions';
import AdminReviews from './pages/admin/AdminReviews';
import AdminArticles from './pages/admin/AdminArticles';
import AdminFaqs from './pages/admin/AdminFaqs';
import AdminVideos from './pages/admin/AdminVideos';
import AdminMessages from './pages/admin/AdminMessages';
import AdminNotifications from './pages/admin/AdminNotifications';

export function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <AuthProvider>
          <SidebarTableProvider>
            <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/veterinarians" element={<Veterinarians />} />
              <Route path="/veterinarians/:id" element={<VeterinarianDetail />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/care" element={<CareResources />} />
              <Route path="/care/articles/:id" element={<ArticleDetail />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/adoption" element={<Adoption />} />
              <Route path="/adoption/:id" element={<AdoptionDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route path="/notifications" element={<ProtectedRoute><RoleDashboardLayout /></ProtectedRoute>}>
              <Route index element={<Notifications />} />
            </Route>
            <Route path="/profile" element={<ProtectedRoute><RoleDashboardLayout /></ProtectedRoute>}>
              <Route index element={<ProfileSettings />} />
            </Route>
            <Route path="/cart" element={<ProtectedRoute><RoleDashboardLayout /></ProtectedRoute>}>
              <Route index element={<Cart />} />
            </Route>

            <Route
              path="/owner"
              element={
                <ProtectedRoute>
                  <RoleRoute roles={['owner']}>
                    <DashboardLayout links={ownerLinks} />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<OwnerDashboard />} />
              <Route path="pets" element={<PetsList />} />
              <Route path="pets/new" element={<PetForm />} />
              <Route path="pets/:id" element={<PetDetail />} />
              <Route path="pets/:id/edit" element={<PetForm />} />
              <Route path="appointments" element={<OwnerAppointments />} />
              <Route path="book/:vetId" element={<BookAppointment />} />
              <Route path="orders" element={<OwnerOrders />} />
            </Route>

            <Route
              path="/veterinarian"
              element={
                <ProtectedRoute>
                  <RoleRoute roles={['veterinarian']}>
                    <DashboardLayout links={vetLinks} />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<VetDashboard />} />
              <Route path="appointments" element={<VetAppointments />} />
              <Route path="patients" element={<VetPatients />} />
              <Route path="patients/:petId" element={<VetPetRecords />} />
              <Route path="profile" element={<VetProfile />} />
            </Route>

            <Route
              path="/shelter"
              element={
                <ProtectedRoute>
                  <RoleRoute roles={['shelter']}>
                    <DashboardLayout links={shelterLinks} />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<ShelterDashboard />} />
              <Route path="listings" element={<ShelterListings />} />
              <Route path="listings/new" element={<ListingForm />} />
              <Route path="listings/:id/edit" element={<ListingForm />} />
              <Route path="listings/:id" element={<ListingManage />} />
              <Route path="profile" element={<ShelterProfile />} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <RoleRoute roles={['admin']}>
                    <DashboardLayout links={adminLinks} />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="pets" element={<AdminPets />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="adoptions" element={<AdminAdoptions />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="faqs" element={<AdminFaqs />} />
              <Route path="videos" element={<AdminVideos />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="notifications" element={<AdminNotifications />} />
            </Route>

            <Route path="*" element={<Home />} />
          </Routes>
        </SidebarTableProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;