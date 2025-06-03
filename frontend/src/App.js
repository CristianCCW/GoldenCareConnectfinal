import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// CEO image - using the provided formal photo
const CEO_IMAGE = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCACAAFADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z";

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll event for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('Please fill in all fields before submitting.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API}/contact`, formData);
      if (response.status === 200) {
        alert('Thank you for your message! We will contact you soon.');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container max-w-8xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="gold-gradient rounded-full p-2 mr-4">
                <i className="fas fa-hands-helping text-white text-3xl"></i>
              </div>
              <div>
                <h1 className="text-xxxlarge font-bold text-gray-800">Golden Care Connect</h1>
                <p className="text-xlarge text-gray-600">Technology Help for Seniors</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+14015364848" className="btn-gold px-6 py-3 rounded-full text-white text-xlarge flex items-center justify-center">
                <i className="fas fa-phone mr-2"></i> Call Us: (401) 536-4848
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="container max-w-8xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
              <h2 className="text-xxxlarge font-bold text-gray-800 mb-6">Empowering Seniors in the Digital Age</h2>
              <p className="text-xlarge text-gray-600 mb-8 leading-relaxed">
                We help seniors navigate technology safely and confidently. Learn how to use your devices, spot scams, and connect with loved ones - all at your own pace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#services" className="btn-gold px-8 py-4 rounded-full text-white text-xlarge font-bold">
                  Our Services <i className="fas fa-arrow-down ml-2"></i>
                </a>
                <a href="#contact" className="bg-white border-2 border-gold px-8 py-4 rounded-full text-gold text-xlarge font-bold">
                  Contact Us <i className="fas fa-envelope ml-2"></i>
                </a>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://images.pexels.com/photos/3791664/pexels-photo-3791664.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Happy senior using tablet with assistance" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-white py-16">
        <div className="container max-w-8xl mx-auto px-4">
          <h2 className="text-xxlarge font-bold text-center text-gray-800 mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center border-2 border-gray-100 hover:border-gold transition-all duration-300">
              <div className="gold-gradient rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <i className="fas fa-mobile-alt text-white text-2xl"></i>
              </div>
              <h3 className="text-xlarge font-bold text-gray-800 mb-4">Basic Training</h3>
              <p className="text-large text-gray-600">Get started with smartphones, tablets, and computers with easy step-by-step guidance.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center border-2 border-gray-100 hover:border-gold transition-all duration-300">
              <div className="gold-gradient rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <i className="fas fa-shield-alt text-white text-2xl"></i>
              </div>
              <h3 className="text-xlarge font-bold text-gray-800 mb-4">Security Coaching</h3>
              <p className="text-large text-gray-600">Learn to identify scams, create strong passwords, and browse safely online.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center border-2 border-gray-100 hover:border-gold transition-all duration-300">
              <div className="gold-gradient rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <i className="fas fa-video text-white text-2xl"></i>
              </div>
              <h3 className="text-xlarge font-bold text-gray-800 mb-4">Staying Connected</h3>
              <p className="text-large text-gray-600">Master email, video calling, and social media to stay in touch with loved ones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Our CEO Section */}
      <section className="bg-gray-100 py-16">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-xxlarge font-bold text-gray-800 mb-6">About Our CEO</h2>
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <img 
              src={CEO_IMAGE}
              alt="Photo of Charles Winship" 
              className="w-64 h-64 object-cover rounded-full shadow-lg mx-auto"
            />
            <div className="text-left max-w-2xl">
              <h3 className="text-xlarge font-bold text-gray-700 mb-2">Charles Winship</h3>
              <p className="text-large text-gray-600 leading-relaxed">
                Charles Winship discovered his passion for helping seniors while working at Bay Village of Sarasota, a retirement community. There, he witnessed firsthand how challenging technology could be for older adults. Inspired to make a difference, Charles founded Golden Care Connect to empower seniors through patient guidance, security awareness, and digital confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16">
        <div className="container max-w-8xl mx-auto px-4">
          <h2 className="text-xxlarge font-bold text-center text-gray-800 mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md border-2 border-gray-100">
              <div className="flex items-center mb-4">
                <div className="gold-gradient rounded-full p-2 mr-4">
                  <i className="fas fa-user text-white text-xl"></i>
                </div>
                <div>
                  <h4 className="text-xlarge font-bold text-gray-800">Martha, 72</h4>
                  <div className="flex text-gold">
                    <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                  </div>
                </div>
              </div>
              <p className="text-large text-gray-600 italic leading-relaxed">
                "I was afraid to use my new iPad until I found Golden Care Connect. Their patient teachers showed me how to video call my grandchildren. Now we talk every Sunday!"
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border-2 border-gray-100">
              <div className="flex items-center mb-4">
                <div className="gold-gradient rounded-full p-2 mr-4">
                  <i className="fas fa-user text-white text-xl"></i>
                </div>
                <div>
                  <h4 className="text-xlarge font-bold text-gray-800">Robert, 68</h4>
                  <div className="flex text-gold">
                    <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                  </div>
                </div>
              </div>
              <p className="text-large text-gray-600 italic leading-relaxed">
                "They saved me from a scam! I almost sent money to someone pretending to be Microsoft. Now I know what to look for and feel much safer online."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-100 py-16">
        <div className="container max-w-8xl mx-auto px-4">
          <h2 className="text-xxlarge font-bold text-center text-gray-800 mb-8">Get In Touch</h2>
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            <div>
              <label htmlFor="name" className="block text-large font-medium text-gray-700 mb-1">Your Name *</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-large focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-large font-medium text-gray-700 mb-1">Your Email *</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-large focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-large font-medium text-gray-700 mb-1">Message *</label>
              <textarea 
                id="message" 
                name="message"
                rows="5" 
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Tell us how we can help you with technology..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-large focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200 resize-vertical"
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`btn-gold w-full px-6 py-4 rounded-full text-white text-xlarge font-bold ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'} <i className="fas fa-paper-plane ml-2"></i>
            </button>
          </form>
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 gold-gradient rounded-full p-4 text-white shadow-lg z-50 hover:shadow-xl transition-all duration-300"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container max-w-8xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="gold-gradient rounded-full p-2 mr-4">
              <i className="fas fa-hands-helping text-white text-2xl"></i>
            </div>
            <h3 className="text-xlarge font-bold">Golden Care Connect</h3>
          </div>
          <p className="text-gray-400 mb-4">Technology Help for Seniors</p>
          <p className="text-gray-400">
            Call us at <a href="tel:+14015364848" className="text-gold hover:underline">(401) 536-4848</a>
          </p>
          <p className="text-gray-500 mt-4 text-sm">
            © 2024 Golden Care Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;