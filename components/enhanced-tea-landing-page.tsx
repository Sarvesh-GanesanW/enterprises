'use client'

import * as Collapsible from '@radix-ui/react-collapsible';
import { ShoppingBagIcon, InformationCircleIcon, EnvelopeIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { CustomDialogContent } from "@/components/ui/custom-dialog";
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import Image from 'next/image';

const API_URL = 'https://sretea.onrender.com/api';

const TeaModal = ({ tea, isOpen, setIsOpen, addToCart }: { tea: Tea, isOpen: boolean, setIsOpen: (isOpen: boolean) => void, addToCart: (tea: Tea) => void }) => (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{tea.title}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Image src={tea.image} alt={tea.title} width={400} height={200} className="w-full h-48 object-cover rounded-lg" />
        <p className="text-sm text-gray-500">{tea.longDescription}</p>
        <div className="space-y-2">
          <p className="text-center font-medium">Retail: {tea.retailPrice}</p>
          <p className="text-center font-medium">Wholesale: {tea.wholesalePrice}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button onClick={() => addToCart(tea)} className="flex-1 bg-green-600 hover:bg-green-700 text-white">Add to Cart</Button>
        <Button onClick={() => setIsOpen(false)} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">Close</Button>
      </div>
    </DialogContent>
  </Dialog>
)

type ContactFormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
};

type OrderFormData = {
  fullName: string;
  address: string;
  phoneNumber: string;
  requirements: string;
  needSample: boolean;
};

type Tea = {
  title: string;
  description: string;
  retailPrice: string;
  wholesalePrice: string;
  image: string;
  longDescription: string;
};

export function EnhancedTeaLandingPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const productsRef = useRef<HTMLElement>(null);
  const aboutUsRef = useRef<HTMLElement>(null);
  const [selectedTea, setSelectedTea] = useState<Tea | null>(null)
  const [isFactsOpen, setIsFactsOpen] = useState(false);
  const [cart, setCart] = useState<Tea[]>([]);


  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart`);
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };


  const addToCart = async (tea: Tea) => {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tea),
      });
      if (response.ok) {
        fetchCart();
        setSelectedTea(null);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    message: '',
  });

  const [orderFormData, setOrderFormData] = useState<OrderFormData>({
    fullName: '',
    address: '',
    phoneNumber: '',
    requirements: '',
    needSample: false,
  });

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderCheckboxChange = (checked: boolean) => {
    setOrderFormData(prev => ({ ...prev, needSample: checked }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactFormData),
      });
      if (response.ok) {
        console.log('Contact form submitted successfully');
        setIsContactModalOpen(false);
        setContactFormData({fullName: '', email: '', phoneNumber: '', message: ''});
      } else {
        console.error('Failed to submit contact form');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };
  
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderFormData),
      });
      if (response.ok) {
        console.log('Order submitted successfully');
        setOrderFormData({fullName: '', address: '', phoneNumber: '', requirements: '', needSample: false});
      } else {
        console.error('Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-amber-50 bg-[url('/tea-pattern.png')] bg-repeat bg-opacity-5 font-fat">
      <header className="w-full bg-white bg-opacity-90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
          <Link className="flex items-center justify-center mb-4 sm:mb-0" href="#">
            <span className="sr-only">Sree Rajalakshmi Enterprises</span>
            <svg
              className="h-8 w-8 text-amber-800"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" x2="6" y1="2" y2="4" />
              <line x1="10" x2="10" y1="2" y2="4" />
              <line x1="14" x2="14" y1="2" y2="4" />
            </svg>
            <span className="ml-2 text-xl font-bold text-amber-800">Sree Rajalakshmi Enterprises</span>
          </Link>
          <nav className="flex justify-center items-center space-x-8">
      <button
        onClick={() => scrollToSection(productsRef)}
        className="flex items-center text-lg font-bold hover:text-amber-600 transition-colors text-amber-800 magnify-effect"
      >
        <span className="flex items-center">
          <ShoppingBagIcon className="h-6 w-6 mr-2" />
          Products
        </span>
      </button>
      <button
        onClick={() => scrollToSection(aboutUsRef)}
        className="flex items-center text-lg font-bold hover:text-amber-600 transition-colors text-amber-800 magnify-effect"
      >
        <span className="flex items-center">
          <InformationCircleIcon className="h-6 w-6 mr-2" />
          About Us
        </span>
      </button>
      <button
        onClick={() => setIsContactModalOpen(true)}
        className="flex items-center text-lg font-bold hover:text-amber-600 transition-colors text-amber-800 magnify-effect"
      >
        <span className="flex items-center">
          <EnvelopeIcon className="h-6 w-6 mr-2" />
          Contact
        </span>
      </button>
    </nav>
        </div>
      </header>
      <Link href="/cart" className="fixed top-4 right-4 z-50">
        <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-4 py-2">
          <ShoppingBagIcon className="h-6 w-6 mr-2" />
          Cart ({cart.length})
        </Button>
      </Link>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-amber-100 via-amber-50 to-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-amber-800 drop-shadow-sm">
                  Discover the Perfect Brew
                </h1>
                <div className="flex justify-center">
                  <svg fill="#FFBF00" height="200px" width="200px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 470 470" xmlnsXlink="http://www.w3.org/1999/xlink" enableBackground="new 0 0 470 470" stroke="#FFBF00"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="m180.568,70.396c0.058,0.398 0.138,0.789 0.256,1.164 3.687,16.088 11.315,30.431 22.661,41.777 16.574,16.575 39.534,25.229 65.001,25.228 12.017,0 24.597-1.93 37.319-5.863 0.066-0.02 0.088-0.025 0.11-0.032 0.046-0.014 0.089-0.036 0.134-0.051 0.211-0.07 0.42-0.148 0.626-0.237 0.08-0.035 0.158-0.073 0.237-0.11 0.178-0.085 0.354-0.177 0.527-0.277 0.078-0.045 0.156-0.089 0.231-0.137 0.172-0.108 0.338-0.225 0.502-0.348 0.064-0.048 0.131-0.092 0.193-0.142 0.217-0.173 0.427-0.357 0.628-0.557 0.206-0.205 0.391-0.418 0.565-0.637 0.046-0.058 0.087-0.12 0.131-0.179 0.128-0.17 0.249-0.343 0.36-0.521 0.044-0.07 0.084-0.142 0.126-0.213 0.105-0.181 0.202-0.365 0.291-0.552 0.033-0.071 0.067-0.14 0.099-0.212 0.096-0.221 0.18-0.444 0.254-0.671 0.011-0.034 0.027-0.066 0.038-0.1 0.005-0.016 0.009-0.033 0.014-0.05 0.008-0.027 0.016-0.055 0.024-0.083 3.829-12.393 5.799-24.802 5.852-36.887 0.019-4.143-3.325-7.515-7.467-7.533-4.16,0-7.515,3.336-7.533,7.467-0.029,6.635-0.736,13.404-2.083,20.229l-44.66-44.66v-46.446c9.865,3.487 18.664,8.89 25.913,16.139 7.588,7.589 13.21,16.822 16.71,27.443 1.296,3.933 5.534,6.074 9.471,4.775 3.934-1.296 6.072-5.536 4.775-9.471-4.24-12.869-11.087-24.091-20.35-33.354-11.343-11.345-25.687-18.973-41.775-22.66-0.373-0.117-0.762-0.197-1.158-0.254-18.211-3.939-38.596-2.873-59.379,3.55-0.019,0.006-0.038,0.011-0.057,0.017-0.019,0.006-0.039,0.011-0.058,0.017-0.037,0.011-0.072,0.029-0.108,0.041-0.224,0.073-0.445,0.156-0.662,0.251-0.072,0.031-0.142,0.065-0.213,0.099-0.188,0.089-0.373,0.186-0.555,0.292-0.07,0.04-0.139,0.08-0.208,0.123-0.183,0.114-0.36,0.238-0.534,0.37-0.054,0.041-0.111,0.078-0.164,0.12-0.22,0.175-0.434,0.361-0.638,0.565-0.204,0.204-0.39,0.419-0.566,0.639-0.041,0.051-0.077,0.105-0.116,0.157-0.134,0.177-0.26,0.357-0.376,0.543-0.041,0.065-0.079,0.132-0.117,0.199-0.108,0.186-0.208,0.376-0.299,0.569-0.031,0.066-0.063,0.132-0.093,0.199-0.099,0.226-0.186,0.456-0.261,0.689-0.01,0.03-0.024,0.058-0.033,0.088-0.022,0.073-0.03,0.1-0.037,0.127-6.42,20.776-7.485,41.154-3.548,59.36zm48.829-8.58h-35.141c-1.592-10.684-1.262-22.189 1.081-34.059l34.06,34.059zm-15.306,40.914c-7.249-7.249-12.653-16.048-16.14-25.914h46.447l44.668,44.668c-29.65,5.852-57.043-0.822-74.975-18.754zm25.915-86.661v35.14l-34.06-34.06c11.87-2.342 23.375-2.672 34.06-1.08z"></path> <path d="m87.5,358.574h40.632c31.729,32.271 73.988,50 119.367,50 92.359,0 167.5-75.141 167.5-167.5v-80c0-4.143-3.357-7.5-7.5-7.5h-320c-4.143,0-7.5,3.357-7.5,7.5v22.814c-20.545,1.732-39.627,10.567-54.372,25.313-16.525,16.527-25.627,38.501-25.627,61.873s9.102,45.345 25.629,61.872c16.527,16.526 38.5,25.628 61.871,25.628zm-51.266-138.766c13.691-13.693 31.897-21.234 51.265-21.234 4.143,0 7.5-3.357 7.5-7.5v-22.5h305v72.5c0,84.089-68.411,152.5-152.5,152.5-42.304,0-81.631-16.925-110.737-47.657-1.416-1.496-3.386-2.343-5.445-2.343h-43.817c-19.364,0-37.57-7.541-51.265-21.235-13.694-13.694-21.235-31.9-21.235-51.265 0-19.366 7.541-37.572 21.234-51.266z"></path> <path d="m87.5,328.574h21.409c2.681,0 5.157-1.431 6.497-3.753 1.339-2.322 1.337-5.183-0.005-7.503-13.348-23.073-20.402-49.438-20.402-76.244v-20c0-4.143-3.357-7.5-7.5-7.5-15.359,0-29.799,5.981-40.658,16.841-10.86,10.86-16.841,25.3-16.841,40.659 0,15.358 5.981,29.798 16.842,40.659 10.86,10.859 25.3,16.841 40.658,16.841zm-30.052-87.553c6.229-6.229 14.053-10.287 22.551-11.792v11.845c0,25.169 5.665,49.986 16.473,72.5h-8.972c-11.352,0-22.024-4.421-30.051-12.448-8.028-8.028-12.449-18.701-12.449-30.052 0-11.353 4.421-22.025 12.448-30.053z"></path> <path d="m247.498,378.574c31.291,0 60.795-10.287 85.324-29.75 3.244-2.574 3.788-7.292 1.213-10.537-2.574-3.244-7.292-3.787-10.537-1.213-21.849,17.336-48.13,26.5-76,26.5-67.547,0-122.5-54.953-122.5-122.5l.001-42.204c9.815,0.83 15.565,3.307 22.03,6.092 8.282,3.568 17.67,7.612 35.466,7.612 17.797,0 27.185-4.044 35.467-7.612 7.958-3.428 14.829-6.388 29.532-6.388 14.704,0 21.576,2.96 29.534,6.388 8.282,3.568 17.671,7.612 35.468,7.612s27.185-4.044 35.468-7.611c6.467-2.786 12.217-5.263 22.035-6.093l-.001,42.204c0,27.871-9.164,54.151-26.5,76-2.575,3.245-2.031,7.963 1.213,10.537 3.244,2.575 7.962,2.031 10.537-1.213 19.463-24.528 29.75-54.033 29.75-85.324l.001-50c0-1.989-0.79-3.896-2.196-5.304-1.407-1.406-3.314-2.196-5.304-2.196-17.798,0-27.186,4.044-35.469,7.612-7.958,3.428-14.83,6.388-29.534,6.388s-21.576-2.96-29.534-6.388c-8.282-3.568-17.671-7.612-35.468-7.612-17.796,0-27.184,4.044-35.466,7.612-7.958,3.428-14.83,6.388-29.533,6.388-14.702,0-21.574-2.96-29.53-6.388-8.282-3.568-17.67-7.612-35.466-7.612-4.142,0-7.5,3.357-7.5,7.5l-.001,50c-9.9476e-14,75.817 61.683,137.5 137.5,137.5z"></path> <path d="m462.5,419.924h-430c-4.143,0-7.5,3.357-7.5,7.5s3.357,7.5 7.5,7.5h4.342l4.326,15.138c3.182,11.138 14.748,19.862 26.332,19.862h360c11.584,0 23.15-8.725 26.333-19.862l4.325-15.138h4.342c4.143,0 7.5-3.357 7.5-7.5s-3.357-7.5-7.5-7.5zm-23.09,26.016c-1.344,4.701-7.021,8.983-11.91,8.983h-360c-4.89,0-10.566-4.282-11.909-8.983l-3.147-11.017h390.114l-3.148,11.017z"></path> </g> </g></svg>
                </div>
                <p className="mx-auto max-w-[700px] text-amber-700 md:text-xl italic">
                &quot;Every cup of tea is a journey through flavors and aromas.&quot;
                </p>
              </div>
              <Button 
                onClick={scrollToProducts}
                className="bg-amber-600 hover:bg-amber-700 text-white rounded-full text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore
              </Button>
            </div>
          </div>
        </section>
        <section id="about" ref={aboutUsRef} className="w-full py-12 md:py-24 lg:py-32 bg-white bg-opacity-80 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 relative">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-amber-800 text-center mb-8">
              About Us
            </h2>
            <div className="text-amber-700 text-lg text-justify max-w-3xl mx-auto space-y-4">
              <p>
                Sree Rajalakshmi Enterprises has been a beacon of quality in the tea industry for four decades. 
                Our journey began in the lush, verdant tea gardens of South India, where we cultivated a profound 
                understanding and appreciation for the intricate art of tea making. Over the years, we have honed 
                our craft, blending traditional wisdom with modern innovation to deliver the finest tea experiences 
                to our esteemed customers. 
              </p>
              <p>
                Today, we stand as a testament to excellence, offering a diverse range of premium teas that cater to 
                the discerning tastes of tea connoisseurs around the world. Our unwavering commitment to quality, 
                sustainability, and customer satisfaction has earned us a revered place in the hearts of tea lovers 
                globally. We take immense pride in our ethical sourcing practices, ensuring that every cup of tea 
                you enjoy is not only a delight to your senses but also a step towards a more sustainable future.
              </p>
              <p>
                At Sree Rajalakshmi Enterprises, we believe that every cup of tea is a journey through flavors and 
                aromas, a moment of tranquility in the hustle and bustle of life. We invite you to join us on this 
                journey, to savor the rich heritage and passion that goes into every blend we create. Experience the 
                warmth, the tradition, and the heartiness of our teas, and discover why we are a trusted name in the 
                world of tea.
              </p>
            </div>
            <div className="mt-8">
              <Collapsible.Root open={isFactsOpen} onOpenChange={setIsFactsOpen}>
                <Collapsible.Trigger className="flex items-center justify-center w-1/4 mx-auto py-2 px-4 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors">
                  <span className="mr-2">{isFactsOpen ? 'Hide' : 'Show'} Tea Facts</span>
                  {isFactsOpen ? (
                    <ChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                  )}
                </Collapsible.Trigger>
                <Collapsible.Content className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-amber-50 bg-opacity-80 rounded-lg shadow-lg px-2 py-4">
                      <p className="text-amber-900 text-sm font-serif italic text-center">
                        &quot;Tea is the second most consumed beverage in the world after water.&quot;
                      </p>
                    </div>
                    <div className="bg-amber-50 bg-opacity-80 rounded-lg shadow-lg px-2 py-4">
                      <p className="text-amber-900 text-sm font-serif italic text-center">
                        &quot;Tea is the only beverage commonly served hot or iced, anytime, anywhere, for any occasion.&quot;
                      </p>
                    </div>
                  </div>
                </Collapsible.Content>
              </Collapsible.Root>
            </div>
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-semibold text-amber-800 mb-4">Ready to Experience Our Legacy?</h3>
              <Button 
                onClick={scrollToProducts}
                className="bg-amber-600 hover:bg-amber-700 text-white rounded-full text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore Our Teas
              </Button>
              <div className="mt-40 w-full flex justify-center">
                {/* Tea Cup SVG */}
                <svg
                  height="200px"
                  width="200px"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="-51.2 -51.2 614.40 614.40"
                  xmlSpace="preserve"
                  fill="#ff4c38"
                  stroke="#ff4c38"
                  strokeWidth="0.00512"
                  transform="matrix(-1, 0, 0, -1, 0, 0)rotate(0)"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="2.048"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path style={{ fill: "#A1A1A1" }} d="M460.358,83.849L436.489,12.24C434.052,4.93,427.211,0,419.506,0H92.494 c-7.706,0-14.546,4.93-16.983,12.24L51.642,83.849c-0.609,1.826-0.919,3.737-0.919,5.662v334.172c0,1.955,0.32,3.897,0.948,5.747 l23.869,70.415C78.003,507.112,84.823,512,92.494,512h327.012c7.673,0,14.492-4.888,16.954-12.156l23.869-70.415 c0.627-1.851,0.948-3.793,0.948-5.747V89.51C461.277,87.587,460.967,85.675,460.358,83.849z"></path>
                    <path style={{ fill: "#D6D6D6" }} d="M256,0H92.494c-7.706,0-14.546,4.93-16.983,12.24L51.642,83.849 c-0.609,1.826-0.919,3.737-0.919,5.662v334.172c0,1.955,0.32,3.897,0.948,5.747l23.869,70.415C78.003,507.112,84.823,512,92.494,512 H256V0z"></path>
                    <path style={{ fill: "#DE9833" }} d="M51.67,429.43l23.869,70.415C78.003,507.112,84.823,512,92.494,512h327.012 c7.673,0,14.492-4.888,16.954-12.156l23.869-70.415c0.627-1.851,0.948-3.793,0.948-5.747H50.723 C50.723,425.638,51.042,427.58,51.67,429.43z"></path>
                    <path style={{ fill: "#F3A938" }} d="M51.67,429.43l23.869,70.415C78.003,507.112,84.823,512,92.494,512H256v-88.317H50.723 C50.723,425.638,51.042,427.58,51.67,429.43z"></path>
                    <path style={{ fill: "#DE9833" }} d="M460.358,83.849L436.489,12.24C434.052,4.93,427.211,0,419.506,0H92.494 c-7.706,0-14.546,4.93-16.983,12.24L51.642,83.849c-0.609,1.826-0.919,3.737-0.919,5.662h410.555 C461.277,87.587,460.967,85.675,460.358,83.849z"></path>
                    <path style={{ fill: "#F3A938" }} d="M256,0H92.494c-7.706,0-14.546,4.93-16.983,12.24L51.642,83.849 c-0.609,1.826-0.919,3.737-0.919,5.662H256V0z"></path>
                    <path style={{ fill: "#DE9833" }} d="M290.342,290.342c23.146-23.146,28.781-57.16,16.929-85.613 c-28.452-11.851-62.466-6.217-85.613,16.929s-28.781,57.16-16.929,85.613C233.181,319.122,267.195,313.488,290.342,290.342z"></path>
                    <path style={{ fill: "#F3A938" }} d="M255.996,201.579c-12.576,3.498-24.449,10.19-34.339,20.08 c-23.146,23.146-28.781,57.16-16.929,85.613c16.294,6.787,34.414,7.839,51.27,3.151L255.996,201.579z"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </section>
        <section id="products" ref={productsRef} className="w-full py-12 md:py-24 lg:py-32 bg-white bg-opacity-80">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-amber-800 text-center mb-12">
              Our Exquisite Tea Collection
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Premium Tea",
                  description: "Exquisite blends for the discerning tea connoisseur.",
                  retailPrice: "₹250/100g",
                  wholesalePrice: "₹220/100g (MOQ: 5kg)",
                  image: "/images/premium-tea.jpg",
                  longDescription: "Our Premium Tea is a luxurious blend of the finest tea leaves, carefully selected from the most renowned tea gardens. This exquisite tea offers a rich, full-bodied flavor with subtle notes of oak and a hint of sweetness. Perfect for those special moments when only the best will do."
                },
                {
                  title: "Classic Tea",
                  description: "Our everyday blends for a perfect cup anytime, anywhere.",
                  retailPrice: "₹180/100g",
                  wholesalePrice: "₹160/100g (MOQ: 10kg)",
                  image: "/images/classic-tea.jpg",
                  longDescription: "The Classic Tea is our signature blend, offering a balanced and refreshing taste that is perfect for any time of day. With its smooth flavor and satisfying aroma, this tea is a staple for tea lovers who appreciate consistency and quality in every cup."
                },
                {
                  title: "Therapeutic Tea",
                  description: "Specially crafted blends for health and wellness.",
                  retailPrice: "₹230/100g",
                  wholesalePrice: "₹200/100g (MOQ: 5kg)",
                  image: "/images/therapeutic-tea.jpg",
                  longDescription: "Our Therapeutic Tea is a carefully crafted blend designed to promote health and wellness. Infused with natural herbs and spices known for their healing properties, this tea offers a soothing and rejuvenating experience. It&apos;s the perfect choice for those looking to incorporate the benefits of traditional herbal remedies into their daily routine."
                }
              ].map((product, index) => (
                <Card key={index} className="bg-amber-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                  <Image src={product.image} alt={product.title} width={400} height={200} className="w-full h-48 object-cover" />
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-amber-800 mb-2">{product.title}</h3>
                    <p className="text-amber-700 mb-4">{product.description}</p>
                    <Button 
                      onClick={() => setSelectedTea(product)} 
                      className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white text-sm mt-2 py-3 px-6 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 border-2 border-amber-700 hover:border-amber-800 animate-pulse-slow"
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          {selectedTea && (
                        <TeaModal 
              tea={selectedTea} 
              isOpen={!!selectedTea} 
              setIsOpen={(isOpen: boolean) => !isOpen && setSelectedTea(null)} 
              addToCart={addToCart}
            />
          )}
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-tl from-amber-100 via-amber-50 to-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-amber-800">
                  Ready to Elevate Your Tea Experience?
                </h2>
                <p className="mx-auto max-w-[600px] text-amber-700 md:text-xl">
                  Indulge in the finest teas from Sree Rajalakshmi Enterprises. Place your order now and transform your tea moments.
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-full text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    Order Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Place Your Order</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleOrderSubmit} className="space-y-4">
                    <Input
                      placeholder="Full Name"
                      name="fullName"
                      value={orderFormData.fullName}
                      onChange={handleOrderInputChange}
                    />
                    <Input
                      placeholder="Address"
                      name="address"
                      value={orderFormData.address}
                      onChange={handleOrderInputChange}
                    />
                    <Input
                      placeholder="Phone Number"
                      name="phoneNumber"
                      value={orderFormData.phoneNumber}
                      onChange={handleOrderInputChange}
                    />
                    <Textarea
                      placeholder="Your Requirements"
                      name="requirements"
                      value={orderFormData.requirements}
                      onChange={handleOrderInputChange}
                      disabled={orderFormData.needSample}
                      className={orderFormData.needSample ? "bg-gray-100 text-gray-500" : ""}
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sample"
                        checked={orderFormData.needSample}
                        onCheckedChange={handleOrderCheckboxChange}
                      />
                      <label htmlFor="sample" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Need a sample? The first one is on us!
                      </label>
                    </div>
                    <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                      Submit Order
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>
      </main>
      <footer id="contact" className="w-full py-12 bg-amber-800 text-amber-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <p className="text-sm mb-2">Phone: <a href="tel:+918778635551">+91 8778635551</a></p>
              <p className="text-sm">Email: <a href="mailto:sreerajalakshmienterprisestea@gmail.com">sreerajalakshmienterprisestea@gmail.com</a></p>
            </div>
            <div className="text-center ml-10">
              <h3 className="text-xl font-semibold mb-4">Visit Us</h3>
              <p className="text-sm">V.R. Pillai Street, Triplicane,</p>
              <p className="text-sm">Chennai, Tamil Nadu, India</p>
            </div>
            <div className="text-center md:text-right">
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex justify-center md:justify-end space-x-4">
                <Link href="#" className="text-amber-50 hover:text-amber-200 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#" className="text-amber-50 hover:text-amber-200 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#" className="text-amber-50 hover:text-amber-200 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-amber-700 pt-8 text-center ml-10">
            <p className="text-xs text-amber-200">© 2024 Sree Rajalakshmi Enterprises. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <Input
              placeholder="Full Name"
              name="fullName"
              value={contactFormData.fullName}
              onChange={handleContactInputChange}
            />
            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={contactFormData.email}
              onChange={handleContactInputChange}
            />
            <Input
              placeholder="Phone Number"
              name="phoneNumber"
              value={contactFormData.phoneNumber}
              onChange={handleContactInputChange}
            />
            <Textarea
              placeholder="Your Message"
              name="message"
              value={contactFormData.message}
              onChange={handleContactInputChange}
            />
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
              Send Message
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Link
        href="https://wa.me/918778635551"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 308 308"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="XMLID_468_">
            <path id="XMLID_469_" d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156
              c-3.032,0-5.579,1.511-7.563,4.479c-2.243,3.334-9.033,11.271-11.131,13.642c-0.274,0.313-0.648,0.687-0.872,0.687
              c-0.201,0-3.676-1.431-4.728-1.888c-24.087-10.463-42.37-35.624-44.877-39.867c-0.358-0.61-0.373-0.887-0.376-0.887
              c0.088-0.323,0.898-1.135,1.316-1.554c1.223-1.21,2.548-2.805,3.83-4.348c0.607-0.731,1.215-1.463,1.812-2.153
              c1.86-2.164,2.688-3.844,3.648-5.79l0.503-1.011c2.344-4.657,0.342-8.587-0.305-9.856c-0.531-1.062-10.012-23.944-11.02-26.348
              c-2.424-5.801-5.627-8.502-10.078-8.502c-0.413,0,0,0-1.732,0.073c-2.109,0.089-13.594,1.601-18.672,4.802
              c-5.385,3.395-14.495,14.217-14.495,33.249c0,17.129,10.87,33.302,15.537,39.453c0.116,0.155,0.329,0.47,0.638,0.922
              c17.873,26.102,40.154,45.446,62.741,54.469c21.745,8.686,32.042,              c2.46,0,4.429-0.193,6.166-0.364l1.102-0.105c7.512-0.666,24.02-9.22,27.775-19.655c2.958-8.219,3.738-17.199,1.77-20.458
              C233.168,179.508,230.845,178.393,227.904,176.981z"/>
            <path id="XMLID_470_" d="M156.734,0C73.318,0,5.454,67.354,5.454,150.143c0,26.777,7.166,52.988,20.741,75.928L0.212,302.716
              c-0.484,1.429-0.124,3.009,0.933,4.085C1.908,307.58,2.943,308,4,308c0.405,0,0.813-0.061,1.211-0.188l79.92-25.396
              c21.87,11.685,46.588,17.853,71.604,17.853C240.143,300.27,308,232.923,308,150.143C308,67.354,240.143,0,156.734,0z
              M156.734,268.994c-23.539,0-46.338-6.797-65.936-19.657c-0.659-0.433-1.424-0.655-2.194-0.655c-0.407,0-0.815,0.062-1.212,0.188
              l-40.035,12.726l12.924-38.129c0.418-1.234,0.209-2.595-0.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677
              c0-65.543,53.754-118.867,119.826-118.867c66.064,0,119.812,53.324,119.812,118.867
              C276.546,215.678,222.799,268.994,156.734,268.994z"/>
          </g>
        </svg>
      </Link>
      <style jsx global>{`
        .magnify-effect {
          display: inline-block;
          transition: transform 0.3s ease-in-out;
        }
        .magnify-effect:hover {
          transform: scale(1.1);
        }
      `}</style>
      {selectedTea && (
        <TeaModal 
          tea={selectedTea} 
          isOpen={!!selectedTea} 
          setIsOpen={(isOpen: boolean) => !isOpen && setSelectedTea(null)} 
          addToCart={addToCart}
        />
      )}
    </div>

  )
}