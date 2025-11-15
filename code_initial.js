<!doctype html>
<html lang="fr" class="h-full">
 <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restaurant Réservation Premium</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="/_sdk/element_sdk.js"></script>
  <script src="/_sdk/data_sdk.js"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <style>
        body {
            box-sizing: border-box;
        }
        
        /* === ANIMATIONS AVANCÉES === */
        .fade-in {
            animation: fadeIn 1s ease-out;
        }
        
        .slide-up {
            animation: slideUp 0.8s ease-out;
        }
        
        .bounce-in {
            animation: bounceIn 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .float {
            animation: float 4s ease-in-out infinite;
        }
        
        .pulse-glow {
            animation: pulseGlow 3s ease-in-out infinite;
        }
        
        .rotate-slow {
            animation: rotateSlow 20s linear infinite;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(60px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounceIn {
            0% { opacity: 0; transform: scale(0.3) rotate(-10deg); }
            50% { opacity: 1; transform: scale(1.1) rotate(5deg); }
            70% { transform: scale(0.9) rotate(-2deg); }
            100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-15px) rotate(1deg); }
            50% { transform: translateY(-10px) rotate(0deg); }
            75% { transform: translateY(-20px) rotate(-1deg); }
        }
        
        @keyframes pulseGlow {
            0%, 100% { 
                box-shadow: 0 0 30px rgba(245, 158, 11, 0.4),
                           0 0 60px rgba(245, 158, 11, 0.2);
            }
            50% { 
                box-shadow: 0 0 50px rgba(245, 158, 11, 0.8),
                           0 0 100px rgba(245, 158, 11, 0.4);
            }
        }
        
        @keyframes rotateSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        /* === FOND ANIMÉ === */
        .animated-gradient {
            background: linear-gradient(-45deg, 
                #fef3c7, #fed7aa, #fde68a, #f59e0b, 
                #d97706, #92400e, #451a03, #fbbf24);
            background-size: 400% 400%;
            animation: gradientShift 20s ease infinite;
        }
        
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            25% { background-position: 100% 50%; }
            50% { background-position: 100% 100%; }
            75% { background-position: 0% 100%; }
            100% { background-position: 0% 50%; }
        }
        
        /* === CARTES MENU PREMIUM === */
        .menu-card {
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
            background: linear-gradient(135deg, #ffffff 0%, #fefbf3 100%);
        }
        
        .menu-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
                transparent, 
                rgba(245, 158, 11, 0.1), 
                rgba(245, 158, 11, 0.2), 
                rgba(245, 158, 11, 0.1), 
                transparent);
            transition: left 0.8s ease;
        }
        
        .menu-card:hover::before {
            left: 100%;
        }
        
        .menu-card:hover {
            transform: translateY(-12px) scale(1.03) rotate(1deg);
            box-shadow: 
                0 30px 60px -12px rgba(0, 0, 0, 0.25),
                0 0 0 1px rgba(245, 158, 11, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }
        
        .menu-card .card-icon {
            transition: all 0.4s ease;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
        }
        
        .menu-card:hover .card-icon {
            transform: scale(1.2) rotate(10deg);
            filter: drop-shadow(0 8px 16px rgba(0,0,0,0.2));
        }
        
        /* === BOUTONS PREMIUM === */
        .btn-primary {
            position: relative;
            overflow: hidden;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            transition: all 0.4s ease;
            box-shadow: 0 8px 25px -8px rgba(245, 158, 11, 0.5);
        }
        
        .btn-primary::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.8s ease, height 0.8s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px -8px rgba(245, 158, 11, 0.7);
        }
        
        .btn-primary:hover::before {
            width: 400px;
            height: 400px;
        }
        
        .btn-secondary {
            background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
            transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
            background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
            transform: translateY(-2px);
        }
        
        /* === NAVIGATION MODERNE === */
        .nav-modern {
            backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.9);
            border-bottom: 1px solid rgba(245, 158, 11, 0.1);
        }
        
        .nav-btn {
            position: relative;
            transition: all 0.3s ease;
        }
        
        .nav-btn::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, #f59e0b, #d97706);
            transition: all 0.3s ease;
            transform: translateX(-50%);
        }
        
        .nav-btn:hover::after,
        .nav-btn.active::after {
            width: 100%;
        }
        
        /* === MODAL PREMIUM === */
        .modal-backdrop {
            backdrop-filter: blur(10px);
            background: rgba(0, 0, 0, 0.6);
            animation: fadeInBackdrop 0.4s ease-out;
        }
        
        @keyframes fadeInBackdrop {
            from { opacity: 0; backdrop-filter: blur(0px); }
            to { opacity: 1; backdrop-filter: blur(10px); }
        }
        
        .modal-content {
            animation: modalSlideIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            background: linear-gradient(135deg, #ffffff 0%, #fefbf3 100%);
            box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.5);
        }
        
        @keyframes modalSlideIn {
            from { 
                opacity: 0; 
                transform: scale(0.7) translateY(-100px) rotate(-5deg); 
            }
            to { 
                opacity: 1; 
                transform: scale(1) translateY(0) rotate(0deg); 
            }
        }
        
        /* === FORMULAIRES STYLISÉS === */
        .form-input {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            background: linear-gradient(135deg, #ffffff 0%, #fefbf3 100%);
            border: 2px solid transparent;
        }
        
        .form-input:focus {
            transform: translateY(-3px);
            box-shadow: 
                0 15px 35px -8px rgba(245, 158, 11, 0.3),
                0 0 0 3px rgba(245, 158, 11, 0.1);
            border-color: #f59e0b;
            background: #ffffff;
        }
        
        /* === STATISTIQUES ANIMÉES === */
        .stat-card {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            background: linear-gradient(135deg, #ffffff 0%, #fefbf3 100%);
            position: relative;
            overflow: hidden;
        }
        
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #f59e0b, #d97706, #92400e);
            transform: scaleX(0);
            transition: transform 0.4s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-8px) rotate(2deg);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .stat-card:hover::before {
            transform: scaleX(1);
        }
        
        /* === IMAGES DE FOND === */
        .hero-bg {
            background: 
                linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.8) 100%),
                url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><radialGradient id="grad1" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:%23fbbf24;stop-opacity:0.3" /><stop offset="100%" style="stop-color:%23d97706;stop-opacity:0.1" /></radialGradient></defs><rect width="1200" height="800" fill="url(%23grad1)"/><circle cx="200" cy="200" r="100" fill="%23ffffff" opacity="0.05"/><circle cx="800" cy="300" r="150" fill="%23ffffff" opacity="0.03"/><circle cx="1000" cy="600" r="120" fill="%23ffffff" opacity="0.04"/></svg>');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
        }
        
        .menu-bg {
            background: 
                linear-gradient(45deg, rgba(254, 243, 199, 0.9) 0%, rgba(253, 230, 138, 0.8) 100%),
                url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20"><circle cx="10" cy="10" r="2" fill="%23f59e0b" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
        }
        
        /* === ICÔNES ANIMÉES === */
        .icon-bounce {
            animation: iconBounce 3s ease-in-out infinite;
        }
        
        .icon-pulse {
            animation: iconPulse 2s ease-in-out infinite;
        }
        
        .icon-rotate {
            animation: iconRotate 4s linear infinite;
        }
        
        @keyframes iconBounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
            40% { transform: translateY(-15px) scale(1.1); }
            60% { transform: translateY(-8px) scale(1.05); }
        }
        
        @keyframes iconPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
        }
        
        @keyframes iconRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        /* === LOADING ET ÉTATS === */
        .spinner {
            border: 3px solid rgba(245, 158, 11, 0.2);
            border-top: 3px solid #f59e0b;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* === NOTIFICATIONS TOAST === */
        .toast {
            animation: toastSlideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(10px);
        }
        
        @keyframes toastSlideIn {
            from { 
                transform: translateX(100%) rotate(10deg); 
                opacity: 0; 
            }
            to { 
                transform: translateX(0) rotate(0deg); 
                opacity: 1; 
            }
        }
        
        /* === EFFETS DE TEXTE === */
        .text-glow {
            text-shadow: 
                0 0 10px rgba(245, 158, 11, 0.5),
                0 0 20px rgba(245, 158, 11, 0.3),
                0 0 30px rgba(245, 158, 11, 0.1);
        }
        
        .text-gradient {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #92400e 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        /* === RESPONSIVE AMÉLIORÉ === */
        @media (max-width: 768px) {
            .menu-card:hover {
                transform: translateY(-6px) scale(1.02);
            }
            
            .hero-bg {
                background-attachment: scroll;
            }
        }
        
        /* === SCROLLBAR PERSONNALISÉE === */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: #fef3c7;
        }
        
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #d97706, #92400e);
        }
    </style>
  <style>@view-transition { navigation: auto; }</style>
 </head>
 <body class="h-full animated-gradient font-sans">
  <div id="app" class="min-h-full"><!-- Navigation Premium -->
   <nav class="nav-modern sticky top-0 z-50 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div class="flex justify-between items-center h-20">
      <div class="flex items-center space-x-4">
       <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center rotate-slow"><i class="fas fa-utensils text-white text-xl"></i>
       </div>
       <h1 id="restaurant-name" class="text-3xl font-bold text-gradient">Le Gourmet Parisien</h1>
      </div>
      <div class="flex space-x-6"><button onclick="showPage('home')" class="nav-btn px-6 py-3 rounded-xl text-amber-800 hover:text-amber-600 font-semibold transition-all duration-300"> <i class="fas fa-home mr-2"></i>Accueil </button> <button onclick="showPage('menu')" class="nav-btn px-6 py-3 rounded-xl text-amber-800 hover:text-amber-600 font-semibold transition-all duration-300"> <i class="fas fa-book-open mr-2"></i>Menu </button> <button onclick="showPage('reservation')" class="nav-btn btn-primary px-8 py-3 rounded-xl text-white font-bold shadow-lg"> <i class="fas fa-calendar-plus mr-2"></i>Réserver </button> <button onclick="showPage('admin')" class="nav-btn px-6 py-3 rounded-xl text-amber-800 hover:text-amber-600 font-semibold transition-all duration-300"> <i class="fas fa-cog mr-2"></i>Admin </button>
      </div>
     </div>
    </div>
   </nav><!-- Page d'Accueil Premium -->
   <div id="home-page" class="page"><!-- Hero Section avec fond animé -->
    <section class="hero-bg min-h-screen flex items-center justify-center relative overflow-hidden">
     <div class="absolute inset-0 opacity-20">
      <div class="absolute top-20 left-20 w-32 h-32 bg-white rounded-full float"></div>
      <div class="absolute top-40 right-32 w-24 h-24 bg-white rounded-full float" style="animation-delay: -1s;"></div>
      <div class="absolute bottom-32 left-1/3 w-40 h-40 bg-white rounded-full float" style="animation-delay: -2s;"></div>
     </div>
     <div class="text-center z-10 max-w-4xl mx-auto px-4">
      <h2 class="text-7xl font-bold text-white mb-8 fade-in text-glow">Bienvenue chez <br><span id="hero-restaurant-name" class="text-gradient bg-white bg-clip-text">Le Gourmet Parisien</span></h2>
      <p id="restaurant-description" class="text-2xl text-white mb-12 slide-up max-w-3xl mx-auto leading-relaxed">Cuisine gastronomique française dans un cadre élégant. Découvrez nos créations culinaires d'exception préparées par notre chef étoilé.</p>
      <div class="space-x-6 bounce-in"><button onclick="showPage('reservation')" class="btn-primary px-12 py-6 rounded-2xl text-xl font-bold text-white shadow-2xl pulse-glow"> <i class="fas fa-calendar-check mr-3"></i> Réserver une table </button> <button onclick="showPage('menu')" class="btn-secondary px-12 py-6 rounded-2xl text-xl font-bold text-white shadow-2xl"> <i class="fas fa-book-open mr-3"></i> Découvrir le menu </button>
      </div>
     </div><!-- Flèche animée vers le bas -->
     <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2"><i class="fas fa-chevron-down text-white text-3xl icon-bounce"></i>
     </div>
    </section><!-- Section Informations -->
    <section class="py-20 bg-white">
     <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h3 class="text-5xl font-bold text-center text-gradient mb-16 fade-in">Informations &amp; Contact</h3>
      <div class="grid md:grid-cols-3 gap-12"><!-- Téléphone -->
       <div class="text-center slide-up">
        <div class="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"><i class="fas fa-phone text-white text-3xl icon-pulse"></i>
        </div>
        <h4 class="text-2xl font-bold text-amber-900 mb-4">Téléphone</h4>
        <p id="contact-phone" class="text-xl text-amber-700 font-semibold">+33 1 42 86 87 88</p>
       </div><!-- Adresse -->
       <div class="text-center slide-up" style="animation-delay: 0.2s;">
        <div class="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"><i class="fas fa-map-marker-alt text-white text-3xl icon-bounce"></i>
        </div>
        <h4 class="text-2xl font-bold text-amber-900 mb-4">Adresse</h4>
        <p id="contact-address" class="text-xl text-amber-700 font-semibold">15 Avenue des Champs-Élysées, Paris</p>
       </div><!-- Email -->
       <div class="text-center slide-up" style="animation-delay: 0.4s;">
        <div class="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"><i class="fas fa-envelope text-white text-3xl icon-rotate"></i>
        </div>
        <h4 class="text-2xl font-bold text-amber-900 mb-4">Email</h4>
        <p class="text-xl text-amber-700 font-semibold">contact@legourmetparisien.fr</p>
       </div>
      </div>
     </div>
    </section><!-- Section Horaires -->
    <section class="py-20 bg-gradient-to-br from-amber-50 to-orange-100">
     <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h3 class="text-5xl font-bold text-center text-gradient mb-16 fade-in">Horaires d'ouverture</h3>
      <div class="bg-white rounded-3xl shadow-2xl p-12 bounce-in">
       <div class="grid md:grid-cols-2 gap-8">
        <div class="space-y-6">
         <div class="flex justify-between items-center py-4 border-b-2 border-amber-100"><span class="text-xl font-bold text-amber-900">Lundi - Vendredi</span> <span class="text-lg text-amber-700 font-semibold">12h00 - 14h30<br>
           19h00 - 22h30</span>
         </div>
         <div class="flex justify-between items-center py-4 border-b-2 border-amber-100"><span class="text-xl font-bold text-amber-900">Samedi</span> <span class="text-lg text-amber-700 font-semibold">12h00 - 15h00<br>
           19h00 - 23h00</span>
         </div>
        </div>
        <div class="space-y-6">
         <div class="flex justify-between items-center py-4 border-b-2 border-amber-100"><span class="text-xl font-bold text-amber-900">Dimanche</span> <span class="text-lg text-amber-700 font-semibold">12h00 - 15h00<br>
           19h00 - 22h00</span>
         </div>
         <div class="flex justify-between items-center py-4"><span class="text-xl font-bold text-red-600">Fermé</span> <span class="text-lg text-red-500 font-semibold">Mardi soir</span>
         </div>
        </div>
       </div>
      </div>
     </div>
    </section>
   </div><!-- Page Menu Premium -->
   <div id="menu-page" class="page hidden">
    <section class="menu-bg min-h-screen py-20">
     <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-6xl font-bold text-gradient text-center mb-20 fade-in text-glow">Notre Menu Gastronomique</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-10"><!-- Entrées -->
       <div class="menu-card bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer slide-up" onclick="showMenuDetail('entrees')">
        <div class="h-64 bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center relative">
         <div class="card-icon text-8xl">
          🥗
         </div>
         <div class="absolute top-4 right-4 bg-white bg-opacity-20 rounded-full p-3"><i class="fas fa-leaf text-white text-xl"></i>
         </div>
        </div>
        <div class="p-8">
         <h3 class="text-2xl font-bold text-amber-900 mb-4">Entrées Raffinées</h3>
         <p class="text-amber-700 mb-6 leading-relaxed">Découvrez nos entrées créatives qui éveilleront vos papilles</p>
         <div class="flex justify-between items-center">
          <div class="text-2xl font-bold text-amber-600">
           À partir de 12€
          </div><i class="fas fa-arrow-right text-amber-600 text-xl"></i>
         </div>
        </div>
       </div><!-- Plats Principaux -->
       <div class="menu-card bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer slide-up" onclick="showMenuDetail('plats')" style="animation-delay: 0.1s;">
        <div class="h-64 bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center relative">
         <div class="card-icon text-8xl">
          🍽️
         </div>
         <div class="absolute top-4 right-4 bg-white bg-opacity-20 rounded-full p-3"><i class="fas fa-star text-white text-xl"></i>
         </div>
        </div>
        <div class="p-8">
         <h3 class="text-2xl font-bold text-amber-900 mb-4">Plats Signature</h3>
         <p class="text-amber-700 mb-6 leading-relaxed">Nos créations culinaires d'exception par notre chef étoilé</p>
         <div class="flex justify-between items-center">
          <div class="text-2xl font-bold text-amber-600">
           À partir de 28€
          </div><i class="fas fa-arrow-right text-amber-600 text-xl"></i>
         </div>
        </div>
       </div><!-- Desserts -->
       <div class="menu-card bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer slide-up" onclick="showMenuDetail('desserts')" style="animation-delay: 0.2s;">
        <div class="h-64 bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 flex items-center justify-center relative">
         <div class="card-icon text-8xl">
          🍰
         </div>
         <div class="absolute top-4 right-4 bg-white bg-opacity-20 rounded-full p-3"><i class="fas fa-heart text-white text-xl"></i>
         </div>
        </div>
        <div class="p-8">
         <h3 class="text-2xl font-bold text-amber-900 mb-4">Desserts Divins</h3>
         <p class="text-amber-700 mb-6 leading-relaxed">Terminez en beauté avec nos créations sucrées</p>
         <div class="flex justify-between items-center">
          <div class="text-2xl font-bold text-amber-600">
           À partir de 14€
          </div><i class="fas fa-arrow-right text-amber-600 text-xl"></i>
         </div>
        </div>
       </div><!-- Boissons -->
       <div class="menu-card bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer slide-up" onclick="showMenuDetail('boissons')" style="animation-delay: 0.3s;">
        <div class="h-64 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center relative">
         <div class="card-icon text-8xl">
          🍷
         </div>
         <div class="absolute top-4 right-4 bg-white bg-opacity-20 rounded-full p-3"><i class="fas fa-wine-glass text-white text-xl"></i>
         </div>
        </div>
        <div class="p-8">
         <h3 class="text-2xl font-bold text-amber-900 mb-4">Cave Exceptionnelle</h3>
         <p class="text-amber-700 mb-6 leading-relaxed">Vins fins, champagnes et cocktails d'exception</p>
         <div class="flex justify-between items-center">
          <div class="text-2xl font-bold text-amber-600">
           À partir de 8€
          </div><i class="fas fa-arrow-right text-amber-600 text-xl"></i>
         </div>
        </div>
       </div><!-- Menu Dégustation -->
       <div class="menu-card bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer slide-up" onclick="showMenuDetail('menu-degustation')" style="animation-delay: 0.4s;">
        <div class="h-64 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center relative">
         <div class="card-icon text-8xl">
          ⭐
         </div>
         <div class="absolute top-4 right-4 bg-white bg-opacity-20 rounded-full p-3"><i class="fas fa-crown text-white text-xl"></i>
         </div>
        </div>
        <div class="p-8">
         <h3 class="text-2xl font-bold text-amber-900 mb-4">Menu Dégustation</h3>
         <p class="text-amber-700 mb-6 leading-relaxed">L'expérience culinaire ultime en 7 services</p>
         <div class="flex justify-between items-center">
          <div class="text-2xl font-bold text-amber-600">
           95€
          </div><i class="fas fa-arrow-right text-amber-600 text-xl"></i>
         </div>
        </div>
       </div><!-- Formules -->
       <div class="menu-card bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer slide-up" onclick="showMenuDetail('formules')" style="animation-delay: 0.5s;">
        <div class="h-64 bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600 flex items-center justify-center relative">
         <div class="card-icon text-8xl">
          🎯
         </div>
         <div class="absolute top-4 right-4 bg-white bg-opacity-20 rounded-full p-3"><i class="fas fa-utensils text-white text-xl"></i>
         </div>
        </div>
        <div class="p-8">
         <h3 class="text-2xl font-bold text-amber-900 mb-4">Formules Gourmandes</h3>
         <p class="text-amber-700 mb-6 leading-relaxed">Nos menus complets pour tous les goûts</p>
         <div class="flex justify-between items-center">
          <div class="text-2xl font-bold text-amber-600">
           À partir de 45€
          </div><i class="fas fa-arrow-right text-amber-600 text-xl"></i>
         </div>
        </div>
       </div>
      </div>
     </div>
    </section>
   </div><!-- Modal Détail Menu Premium -->
   <div id="menu-modal" class="fixed inset-0 modal-backdrop hidden z-50 flex items-center justify-center p-4">
    <div class="modal-content bg-white rounded-3xl max-w-4xl w-full max-h-[90%] overflow-y-auto shadow-2xl">
     <div class="p-8">
      <div class="flex justify-between items-center mb-8">
       <h3 id="modal-title" class="text-4xl font-bold text-gradient"></h3><button onclick="closeMenuModal()" class="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 text-white rounded-full hover:from-red-500 hover:to-red-700 transition-all duration-300 flex items-center justify-center"> <i class="fas fa-times text-xl"></i> </button>
      </div>
      <div id="modal-content" class="space-y-6"></div>
     </div>
    </div>
   </div><!-- Page Réservation Premium -->
   <div id="reservation-page" class="page hidden">
    <section class="min-h-screen py-20 bg-gradient-to-br from-amber-50 to-orange-100">
     <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-6xl font-bold text-gradient text-center mb-16 fade-in text-glow">Réserver votre table</h2>
      <div class="bg-white rounded-3xl shadow-2xl p-12 slide-up">
       <form id="reservation-form" class="space-y-8">
        <div class="grid md:grid-cols-2 gap-8">
         <div><label for="customer-name" class="block text-lg font-bold text-amber-900 mb-3"> <i class="fas fa-user mr-2"></i>Nom complet * </label> <input type="text" id="customer-name" required class="form-input w-full px-6 py-4 rounded-xl text-lg">
         </div>
         <div><label for="customer-email" class="block text-lg font-bold text-amber-900 mb-3"> <i class="fas fa-envelope mr-2"></i>Email * </label> <input type="email" id="customer-email" required class="form-input w-full px-6 py-4 rounded-xl text-lg">
         </div>
        </div>
        <div><label for="customer-phone" class="block text-lg font-bold text-amber-900 mb-3"> <i class="fas fa-phone mr-2"></i>Téléphone * </label> <input type="tel" id="customer-phone" required class="form-input w-full px-6 py-4 rounded-xl text-lg">
        </div>
        <div class="grid md:grid-cols-2 gap-8">
         <div><label for="reservation-date" class="block text-lg font-bold text-amber-900 mb-3"> <i class="fas fa-calendar mr-2"></i>Date * </label> <input type="date" id="reservation-date" required class="form-input w-full px-6 py-4 rounded-xl text-lg">
         </div>
         <div><label for="reservation-time" class="block text-lg font-bold text-amber-900 mb-3"> <i class="fas fa-clock mr-2"></i>Heure * </label> <select id="reservation-time" required class="form-input w-full px-6 py-4 rounded-xl text-lg"> <option value="">Choisir une heure</option> <option value="12:00">12h00</option> <option value="12:30">12h30</option> <option value="13:00">13h00</option> <option value="13:30">13h30</option> <option value="14:00">14h00</option> <option value="19:00">19h00</option> <option value="19:30">19h30</option> <option value="20:00">20h00</option> <option value="20:30">20h30</option> <option value="21:00">21h00</option> <option value="21:30">21h30</option> <option value="22:00">22h00</option> </select>
         </div>
        </div>
        <div><label for="guests-count" class="block text-lg font-bold text-amber-900 mb-3"> <i class="fas fa-users mr-2"></i>Nombre de personnes * </label> <select id="guests-count" required class="form-input w-full px-6 py-4 rounded-xl text-lg"> <option value="">Choisir le nombre</option> <option value="1">1 personne</option> <option value="2">2 personnes</option> <option value="3">3 personnes</option> <option value="4">4 personnes</option> <option value="5">5 personnes</option> <option value="6">6 personnes</option> <option value="7">7 personnes</option> <option value="8">8 personnes</option> <option value="9">9 personnes</option> <option value="10">10+ personnes</option> </select>
        </div>
        <div><label for="special-requests" class="block text-lg font-bold text-amber-900 mb-3"> <i class="fas fa-comment mr-2"></i>Demandes spéciales </label> <textarea id="special-requests" rows="4" class="form-input w-full px-6 py-4 rounded-xl text-lg" placeholder="Allergies, régimes spéciaux, occasion spéciale..."></textarea>
        </div><button type="submit" id="submit-reservation" class="btn-primary w-full py-6 rounded-2xl text-2xl font-bold text-white shadow-2xl pulse-glow"> <i class="fas fa-check-circle mr-3"></i> <span id="submit-text">Confirmer la réservation</span>
         <div id="submit-spinner" class="spinner hidden inline-block ml-3"></div></button>
       </form>
       <div id="reservation-success" class="hidden text-center py-12 bounce-in">
        <div class="text-8xl mb-8">
         ✨
        </div>
        <h3 class="text-4xl font-bold text-green-600 mb-6">Réservation confirmée !</h3>
        <p class="text-xl text-amber-700 mb-8 leading-relaxed">Nous avons bien reçu votre demande de réservation.<br>
          Vous recevrez une confirmation par email sous peu.</p><button onclick="resetReservationForm()" class="btn-primary px-8 py-4 rounded-xl text-lg font-bold text-white shadow-lg"> <i class="fas fa-plus mr-2"></i>Nouvelle réservation </button>
       </div>
      </div>
     </div>
    </section>
   </div><!-- Page Admin Premium -->
   <div id="admin-page" class="page hidden">
    <section class="min-h-screen py-20 bg-gradient-to-br from-gray-50 to-gray-100">
     <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-6xl font-bold text-gradient text-center mb-16 fade-in text-glow">Administration</h2><!-- Statistiques Premium -->
      <div class="grid md:grid-cols-4 gap-8 mb-16">
       <div class="stat-card rounded-3xl shadow-2xl p-8 text-center slide-up">
        <div class="text-5xl font-bold text-amber-600 mb-2" id="total-reservations">
         0
        </div>
        <div class="text-amber-700 text-lg font-semibold">
         Total réservations
        </div><i class="fas fa-chart-line text-amber-400 text-2xl mt-4"></i>
       </div>
       <div class="stat-card rounded-3xl shadow-2xl p-8 text-center slide-up" style="animation-delay: 0.1s;">
        <div class="text-5xl font-bold text-green-600 mb-2" id="confirmed-reservations">
         0
        </div>
        <div class="text-amber-700 text-lg font-semibold">
         Confirmées
        </div><i class="fas fa-check-circle text-green-400 text-2xl mt-4"></i>
       </div>
       <div class="stat-card rounded-3xl shadow-2xl p-8 text-center slide-up" style="animation-delay: 0.2s;">
        <div class="text-5xl font-bold text-yellow-600 mb-2" id="pending-reservations">
         0
        </div>
        <div class="text-amber-700 text-lg font-semibold">
         En attente
        </div><i class="fas fa-clock text-yellow-400 text-2xl mt-4"></i>
       </div>
       <div class="stat-card rounded-3xl shadow-2xl p-8 text-center slide-up" style="animation-delay: 0.3s;">
        <div class="text-5xl font-bold text-red-600 mb-2" id="cancelled-reservations">
         0
        </div>
        <div class="text-amber-700 text-lg font-semibold">
         Annulées
        </div><i class="fas fa-times-circle text-red-400 text-2xl mt-4"></i>
       </div>
      </div><!-- Filtres Premium -->
      <div class="bg-white rounded-3xl shadow-2xl p-8 mb-12 bounce-in">
       <h3 class="text-3xl font-bold text-gradient mb-8"><i class="fas fa-filter mr-3"></i>Filtres</h3>
       <div class="grid md:grid-cols-4 gap-6">
        <div><label for="filter-date" class="block text-lg font-bold text-amber-900 mb-3"> <i class="fas fa-calendar mr-2"></i>Date </label> <input type="date" id="filter-date" class="form-input w-full px-4 py-3 rounded-xl">
        </div>
        <div><label for="filter-status" class="block text-lg font-bold text-amber-900 mb-3"> <i class="fas fa-tag mr-2"></i>Statut </label> <select id="filter-status" class="form-input w-full px-4 py-3 rounded-xl"> <option value="">Tous les statuts</option> <option value="pending">En attente</option> <option value="confirmed">Confirmée</option> <option value="cancelled">Annulée</option> </select>
        </div>
        <div class="flex items-end"><button onclick="applyFilters()" class="btn-primary px-8 py-3 rounded-xl font-bold text-white shadow-lg"> <i class="fas fa-search mr-2"></i>Appliquer </button>
        </div>
        <div class="flex items-end"><button onclick="clearFilters()" class="btn-secondary px-8 py-3 rounded-xl font-bold text-white shadow-lg"> <i class="fas fa-eraser mr-2"></i>Effacer </button>
        </div>
       </div>
      </div><!-- Liste des réservations Premium -->
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden fade-in">
       <div class="px-8 py-6 bg-gradient-to-r from-amber-500 to-amber-600">
        <h3 class="text-3xl font-bold text-white"><i class="fas fa-list mr-3"></i>Réservations</h3>
       </div>
       <div id="reservations-list" class="divide-y divide-amber-100">
        <div class="p-12 text-center text-amber-600"><i class="fas fa-calendar-times text-6xl mb-4 opacity-50"></i>
         <p class="text-2xl font-semibold">Aucune réservation pour le moment</p>
        </div>
       </div>
      </div>
     </div>
    </section>
   </div>
  </div>
  <script>
        // Configuration par défaut
        const defaultConfig = {
            restaurant_name: "Le Gourmet Parisien",
            restaurant_description: "Cuisine gastronomique française dans un cadre élégant. Découvrez nos créations culinaires d'exception préparées par notre chef étoilé.",
            contact_phone: "+33 1 42 86 87 88",
            contact_address: "15 Avenue des Champs-Élysées, Paris"
        };

        // Variables globales
        let currentPage = 'home';
        let reservations = [];
        let filteredReservations = [];

        // Données du menu premium
        const menuData = {
            'entrees': {
                title: 'Entrées Raffinées',
                items: [
                    { name: 'Foie gras mi-cuit aux figues', description: 'Foie gras de canard, compotée de figues, brioche dorée', price: '24€' },
                    { name: 'Saint-Jacques snackées', description: 'Noix de Saint-Jacques, purée de topinambour, caviar d\'Aquitaine', price: '28€' },
                    { name: 'Tartare de thon rouge', description: 'Thon rouge de ligne, avocat, wasabi, sésame noir', price: '22€' },
                    { name: 'Velouté de châtaignes', description: 'Crème de châtaignes, truffe noire, huile de noisette', price: '18€' }
                ]
            },
            'plats': {
                title: 'Plats Signature',
                items: [
                    { name: 'Bœuf de Kobé grillé', description: 'Filet de bœuf de Kobé, jus au vin rouge, légumes de saison', price: '65€' },
                    { name: 'Homard bleu thermidor', description: 'Homard breton, sauce thermidor, riz pilaf aux herbes', price: '48€' },
                    { name: 'Pigeon en croûte de sel', description: 'Pigeon fermier, croûte aux herbes, jus corsé', price: '42€' },
                    { name: 'Turbot sauvage', description: 'Filet de turbot, beurre blanc aux agrumes, légumes croquants', price: '38€' }
                ]
            },
            'desserts': {
                title: 'Desserts Divins',
                items: [
                    { name: 'Soufflé au Grand Marnier', description: 'Soufflé chaud, glace vanille Bourbon, tuile aux amandes', price: '16€' },
                    { name: 'Tarte au chocolat Valrhona', description: 'Chocolat noir 70%, ganache onctueuse, or comestible', price: '14€' },
                    { name: 'Mille-feuille revisité', description: 'Pâte feuilletée croustillante, crème diplomate, fruits rouges', price: '15€' },
                    { name: 'Baba au rhum', description: 'Baba artisanal, rhum vieux, chantilly vanillée', price: '13€' }
                ]
            },
            'boissons': {
                title: 'Cave Exceptionnelle',
                items: [
                    { name: 'Champagne Dom Pérignon', description: 'Millésime 2012, bulles fines et persistantes', price: '280€' },
                    { name: 'Bordeaux Pauillac', description: 'Château Lafite Rothschild 2015', price: '450€' },
                    { name: 'Bourgogne Gevrey-Chambertin', description: 'Domaine Armand Rousseau 2018', price: '180€' },
                    { name: 'Cocktails signature', description: 'Créations du chef barman, spiritueux premium', price: '18€-25€' }
                ]
            },
            'menu-degustation': {
                title: 'Menu Dégustation',
                items: [
                    { name: 'Parcours Gastronomique', description: '7 services d\'exception avec accords mets-vins', price: '95€' },
                    { name: 'Accord mets-vins', description: 'Sélection de 5 vins par notre sommelier', price: '+45€' },
                    { name: 'Menu végétarien', description: '7 services créatifs autour des légumes', price: '85€' }
                ]
            },
            'formules': {
                title: 'Formules Gourmandes',
                items: [
                    { name: 'Menu Découverte', description: 'Entrée + Plat + Dessert + Vin', price: '65€' },
                    { name: 'Menu Affaires', description: 'Formule déjeuner rapide et raffinée', price: '45€' },
                    { name: 'Menu Romantique', description: 'Dîner aux chandelles avec champagne', price: '120€' }
                ]
            }
        };

        // Gestionnaire de données
        const dataHandler = {
            onDataChanged(data) {
                reservations = data;
                filteredReservations = [...data];
                updateReservationsList();
                updateStatistics();
            }
        };

        // Fonctions de navigation avec animations
        function showPage(pageId) {
            // Masquer toutes les pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.add('hidden');
            });
            
            // Afficher la page demandée avec animation
            const targetPage = document.getElementById(pageId + '-page');
            targetPage.classList.remove('hidden');
            
            // Ajouter classe d'animation
            setTimeout(() => {
                targetPage.classList.add('fade-in');
            }, 50);
            
            currentPage = pageId;

            // Mise à jour des boutons de navigation
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const activeBtn = document.querySelector(`button[onclick="showPage('${pageId}')"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
        }

        // Fonctions du menu avec animations
        function showMenuDetail(category) {
            const modal = document.getElementById('menu-modal');
            const title = document.getElementById('modal-title');
            const content = document.getElementById('modal-content');
            
            const menuCategory = menuData[category];
            title.innerHTML = `<i class="fas fa-utensils mr-3"></i>${menuCategory.title}`;
            
            content.innerHTML = menuCategory.items.map((item, index) => `
                <div class="border-b-2 border-amber-100 pb-6 last:border-b-0 slide-up" style="animation-delay: ${index * 0.1}s;">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h4 class="text-2xl font-bold text-amber-900 mb-3">${item.name}</h4>
                            <p class="text-amber-700 text-lg leading-relaxed">${item.description}</p>
                        </div>
                        <div class="text-3xl font-bold text-amber-600 ml-6">${item.price}</div>
                    </div>
                </div>
            `).join('');
            
            modal.classList.remove('hidden');
        }

        function closeMenuModal() {
            document.getElementById('menu-modal').classList.add('hidden');
        }

        // Fonctions de réservation avec animations
        async function handleReservationSubmit(event) {
            event.preventDefault();
            
            if (reservations.length >= 999) {
                showToast("Limite de 999 réservations atteinte. Veuillez supprimer des réservations anciennes.", "error");
                return;
            }

            const submitButton = document.getElementById('submit-reservation');
            const submitText = document.getElementById('submit-text');
            const submitSpinner = document.getElementById('submit-spinner');
            
            // Animation de chargement
            submitButton.disabled = true;
            submitText.textContent = 'Envoi en cours...';
            submitSpinner.classList.remove('hidden');

            const formData = {
                id: Date.now().toString(),
                type: 'reservation',
                customerName: document.getElementById('customer-name').value,
                customerEmail: document.getElementById('customer-email').value,
                customerPhone: document.getElementById('customer-phone').value,
                date: document.getElementById('reservation-date').value,
                time: document.getElementById('reservation-time').value,
                guests: parseInt(document.getElementById('guests-count').value),
                specialRequests: document.getElementById('special-requests').value,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            const result = await window.dataSdk.create(formData);
            
            if (result.isOk) {
                document.getElementById('reservation-form').classList.add('hidden');
                document.getElementById('reservation-success').classList.remove('hidden');
                showToast("Réservation enregistrée avec succès !", "success");
            } else {
                showToast("Erreur lors de l'enregistrement. Veuillez réessayer.", "error");
            }

            // Réinitialiser le bouton
            submitButton.disabled = false;
            submitText.textContent = 'Confirmer la réservation';
            submitSpinner.classList.add('hidden');
        }

        function resetReservationForm() {
            document.getElementById('reservation-form').reset();
            document.getElementById('reservation-form').classList.remove('hidden');
            document.getElementById('reservation-success').classList.add('hidden');
        }

        // Fonctions admin avec animations
        function updateReservationsList() {
            const container = document.getElementById('reservations-list');
            
            if (filteredReservations.length === 0) {
                container.innerHTML = `
                    <div class="p-12 text-center text-amber-600">
                        <i class="fas fa-calendar-times text-6xl mb-4 opacity-50"></i>
                        <p class="text-2xl font-semibold">Aucune réservation trouvée</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = filteredReservations.map((reservation, index) => `
                <div class="p-8 hover:bg-amber-50 transition-all duration-300 slide-up" style="animation-delay: ${index * 0.05}s;">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <div class="flex items-center space-x-6 mb-4">
                                <h4 class="text-2xl font-bold text-amber-900">${reservation.customerName}</h4>
                                <span class="px-4 py-2 rounded-full text-sm font-bold ${getStatusClass(reservation.status)}">
                                    <i class="fas ${getStatusIcon(reservation.status)} mr-2"></i>
                                    ${getStatusText(reservation.status)}
                                </span>
                            </div>
                            <div class="grid md:grid-cols-2 gap-4 text-amber-700 mb-4">
                                <div class="flex items-center">
                                    <i class="fas fa-envelope mr-3 text-amber-500"></i>
                                    <span class="text-lg">${reservation.customerEmail}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-phone mr-3 text-amber-500"></i>
                                    <span class="text-lg">${reservation.customerPhone}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-calendar mr-3 text-amber-500"></i>
                                    <span class="text-lg">${formatDate(reservation.date)} à ${reservation.time}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-users mr-3 text-amber-500"></i>
                                    <span class="text-lg">${reservation.guests} personne${reservation.guests > 1 ? 's' : ''}</span>
                                </div>
                            </div>
                            ${reservation.specialRequests ? `
                                <div class="bg-amber-50 rounded-xl p-4 mt-4">
                                    <div class="flex items-start">
                                        <i class="fas fa-comment text-amber-600 mr-3 mt-1"></i>
                                        <span class="text-amber-800 font-medium">${reservation.specialRequests}</span>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        <div class="flex flex-col space-y-3 ml-6">
                            ${reservation.status === 'pending' ? `
                                <button onclick="updateReservationStatus('${reservation.__backendId}', 'confirmed')" 
                                        class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg">
                                    <i class="fas fa-check mr-2"></i>Confirmer
                                </button>
                            ` : ''}
                            ${reservation.status !== 'cancelled' ? `
                                <button onclick="updateReservationStatus('${reservation.__backendId}', 'cancelled')" 
                                        class="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg">
                                    <i class="fas fa-times mr-2"></i>Annuler
                                </button>
                            ` : ''}
                            <button onclick="deleteReservation('${reservation.__backendId}')" 
                                    class="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg">
                                <i class="fas fa-trash mr-2"></i>Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        async function updateReservationStatus(backendId, newStatus) {
            const reservation = reservations.find(r => r.__backendId === backendId);
            if (!reservation) return;

            const updatedReservation = { ...reservation, status: newStatus };
            const result = await window.dataSdk.update(updatedReservation);
            
            if (result.isOk) {
                showToast(`Réservation ${getStatusText(newStatus).toLowerCase()}`, "success");
            } else {
                showToast("Erreur lors de la mise à jour", "error");
            }
        }

        async function deleteReservation(backendId) {
            const reservation = reservations.find(r => r.__backendId === backendId);
            if (!reservation) return;

            const result = await window.dataSdk.delete(reservation);
            
            if (result.isOk) {
                showToast("Réservation supprimée", "success");
            } else {
                showToast("Erreur lors de la suppression", "error");
            }
        }

        function updateStatistics() {
            const total = reservations.length;
            const confirmed = reservations.filter(r => r.status === 'confirmed').length;
            const pending = reservations.filter(r => r.status === 'pending').length;
            const cancelled = reservations.filter(r => r.status === 'cancelled').length;

            // Animation des chiffres
            animateNumber('total-reservations', total);
            animateNumber('confirmed-reservations', confirmed);
            animateNumber('pending-reservations', pending);
            animateNumber('cancelled-reservations', cancelled);
        }

        function animateNumber(elementId, targetValue) {
            const element = document.getElementById(elementId);
            const currentValue = parseInt(element.textContent) || 0;
            const increment = targetValue > currentValue ? 1 : -1;
            const duration = 1000;
            const steps = Math.abs(targetValue - currentValue);
            const stepDuration = steps > 0 ? duration / steps : 0;

            let current = currentValue;
            const timer = setInterval(() => {
                current += increment;
                element.textContent = current;
                
                if (current === targetValue) {
                    clearInterval(timer);
                }
            }, stepDuration);
        }

        function applyFilters() {
            const dateFilter = document.getElementById('filter-date').value;
            const statusFilter = document.getElementById('filter-status').value;

            filteredReservations = reservations.filter(reservation => {
                const matchesDate = !dateFilter || reservation.date === dateFilter;
                const matchesStatus = !statusFilter || reservation.status === statusFilter;
                return matchesDate && matchesStatus;
            });

            updateReservationsList();
        }

        function clearFilters() {
            document.getElementById('filter-date').value = '';
            document.getElementById('filter-status').value = '';
            filteredReservations = [...reservations];
            updateReservationsList();
        }

        // Fonctions utilitaires améliorées
        function getStatusClass(status) {
            switch(status) {
                case 'confirmed': return 'bg-green-100 text-green-800 border border-green-200';
                case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
                case 'cancelled': return 'bg-red-100 text-red-800 border border-red-200';
                default: return 'bg-gray-100 text-gray-800 border border-gray-200';
            }
        }

        function getStatusIcon(status) {
            switch(status) {
                case 'confirmed': return 'fa-check-circle';
                case 'pending': return 'fa-clock';
                case 'cancelled': return 'fa-times-circle';
                default: return 'fa-question-circle';
            }
        }

        function getStatusText(status) {
            switch(status) {
                case 'confirmed': return 'Confirmée';
                case 'pending': return 'En attente';
                case 'cancelled': return 'Annulée';
                default: return 'Inconnu';
            }
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            const icons = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle',
                info: 'fa-info-circle'
            };
            const colors = {
                success: 'from-green-500 to-green-600',
                error: 'from-red-500 to-red-600',
                info: 'from-blue-500 to-blue-600'
            };
            
            toast.className = `toast fixed top-6 right-6 z-50 px-8 py-4 rounded-2xl text-white font-bold shadow-2xl bg-gradient-to-r ${colors[type]}`;
            toast.innerHTML = `
                <div class="flex items-center">
                    <i class="fas ${icons[type]} mr-3 text-xl"></i>
                    <span class="text-lg">${message}</span>
                </div>
            `;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
                setTimeout(() => toast.remove(), 300);
            }, 4000);
        }

        // Configuration des éléments éditables
        async function onConfigChange(config) {
            const restaurantName = config.restaurant_name || defaultConfig.restaurant_name;
            const restaurantDescription = config.restaurant_description || defaultConfig.restaurant_description;
            const contactPhone = config.contact_phone || defaultConfig.contact_phone;
            const contactAddress = config.contact_address || defaultConfig.contact_address;

            document.getElementById('restaurant-name').textContent = restaurantName;
            document.getElementById('hero-restaurant-name').textContent = restaurantName;
            document.getElementById('restaurant-description').textContent = restaurantDescription;
            document.getElementById('contact-phone').textContent = contactPhone;
            document.getElementById('contact-address').textContent = contactAddress;
        }

        // Initialisation avec animations
        document.addEventListener('DOMContentLoaded', async function() {
            // Configuration de la date minimum pour les réservations
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('reservation-date').min = today;

            // Gestionnaire de formulaire
            document.getElementById('reservation-form').addEventListener('submit', handleReservationSubmit);

            // Fermeture du modal en cliquant à l'extérieur
            document.getElementById('menu-modal').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeMenuModal();
                }
            });

            // Animation d'entrée de la page
            setTimeout(() => {
                document.getElementById('home-page').classList.add('fade-in');
            }, 100);

            // Initialisation des SDKs
            if (window.dataSdk) {
                const initResult = await window.dataSdk.init(dataHandler);
                if (!initResult.isOk) {
                    console.error("Erreur d'initialisation du Data SDK");
                }
            }

            if (window.elementSdk) {
                await window.elementSdk.init({
                    defaultConfig,
                    onConfigChange,
                    mapToCapabilities: (config) => ({
                        recolorables: [],
                        borderables: [],
                        fontEditable: undefined,
                        fontSizeable: undefined
                    }),
                    mapToEditPanelValues: (config) => new Map([
                        ["restaurant_name", config.restaurant_name || defaultConfig.restaurant_name],
                        ["restaurant_description", config.restaurant_description || defaultConfig.restaurant_description],
                        ["contact_phone", config.contact_phone || defaultConfig.contact_phone],
                        ["contact_address", config.contact_address || defaultConfig.contact_address]
                    ])
                });
            }
        });
    </script>
 <script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'99e9724b36511221',t:'MTc2MzE1NDExMS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>
</html>
