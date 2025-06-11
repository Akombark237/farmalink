'use client';

import { Mail, MapPin, MessageSquare, Phone, Send, Clock, Globe, Users } from 'lucide-react';
import Head from 'next/head';
import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  [key: string]: string | undefined;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // This would be replaced with your actual API endpoint
        // For now, we'll simulate a successful submission after a delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });

        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 5000);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | PharmaLink Cameroon</title>
        <meta name="description" content="Contact PharmaLink Cameroon for pharmacy services, medication inquiries, and support in Yaoundé and across Cameroon." />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Contact PharmaLink Cameroon</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Besoin d'aide avec nos services pharmaceutiques? Vous avez des questions sur les médicaments? 
            Nous sommes là pour vous aider. Contactez-nous via le formulaire ci-dessous ou utilisez nos coordonnées.
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2">
            <em>Need help with our pharmaceutical services? Have questions about medications? 
            We're here to help. Contact us via the form below or use our contact information.</em>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Contact Information */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Informations de Contact</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Adresse Principale</h3>
                    <p className="text-gray-600 mt-1">
                      Avenue Ahmadou Ahidjo<br />
                      Centre-ville, Yaoundé<br />
                      Région du Centre, Cameroun
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Téléphones</h3>
                    <p className="text-gray-600 mt-1">
                      Service Client: +237 2 22 22 14 76<br />
                      Support Technique: +237 2 22 22 14 23<br />
                      Urgences: +237 6 77 88 99 00
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Email</h3>
                    <p className="text-gray-600 mt-1">
                      Général: info@pharmalink.cm<br />
                      Support: support@pharmalink.cm<br />
                      Pharmacies: pharmacies@pharmalink.cm
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Heures d'Ouverture</h3>
                    <p className="text-gray-600 mt-1">
                      Lundi - Vendredi: 7h00 - 19h00<br />
                      Samedi: 8h00 - 17h00<br />
                      Dimanche: 9h00 - 15h00 (Urgences)
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Globe className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Zones de Service</h3>
                    <p className="text-gray-600 mt-1">
                      Yaoundé et environs<br />
                      Douala (bientôt)<br />
                      Livraison dans tout le Cameroun
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Partenaires</h3>
                    <p className="text-gray-600 mt-1">
                      18+ Pharmacies partenaires<br />
                      Pharmaciens certifiés<br />
                      Médicaments authentiques
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Envoyez-nous un Message</h2>

              {submitSuccess && (
                <div className="mb-6 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded">
                  Merci pour votre message! Nous vous répondrons dans les plus brefs délais.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Votre Nom
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Jean Dupont"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="jean@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.subject ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Comment pouvons-nous vous aider?"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                  )}
                </div>

                <div className="mt-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Veuillez fournir des détails sur votre demande..."
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                      isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Envoyer le Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Questions Fréquemment Posées</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Dans combien de temps recevrai-je une réponse?</h3>
              <p className="text-gray-600">
                Nous nous efforçons de répondre à toutes les demandes dans les 24-48 heures ouvrables. 
                Pour les urgences, veuillez contacter notre ligne d'assistance.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Y a-t-il un numéro pour le support technique?</h3>
              <p className="text-gray-600">
                Oui, vous pouvez joindre notre équipe de support technique au +237 2 22 22 14 23, 
                disponible du lundi au vendredi de 7h00 à 19h00.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Comment signaler un problème avec une commande?</h3>
              <p className="text-gray-600">
                Pour les problèmes liés aux commandes, utilisez le formulaire de contact et sélectionnez 
                "Problème de commande" comme sujet, ou envoyez un email à support@pharmalink.cm avec votre numéro de commande.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Les médicaments sont-ils authentiques?</h3>
              <p className="text-gray-600">
                Absolument! Tous nos médicaments proviennent de pharmacies certifiées au Cameroun et sont 
                approuvés par les autorités sanitaires. Nous garantissons l'authenticité de tous nos produits.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
