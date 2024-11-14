<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'HR Management System')</title>
    <!-- Importation des fichiers Vite (CSS & JS) -->
    <!-- Tailwind CSS via CDN -->
     
    <!-- Fonts -->
    <link href="https://fonts.bunny.net/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="antialiased bg-gray-100">

    <!-- Navbar -->
    <nav class="bg-white shadow p-4">
        <div class="max-w-7xl mx-auto flex justify-between">
            <a href="{{ url('/') }}" class="text-lg font-semibold text-gray-700">HR Management</a>
        </div>
    </nav>

    <!-- Main layout with sidebar and content -->
    <div class="flex">

        <!-- Sidebar (Left Column) -->
        <aside class="w-1/5 bg-white h-screen p-4 shadow-lg">
            <!-- Logo -->
            <div class="mb-8">
                <img src="path-to-logo" alt="GBEWA Logo" class="w-20 h-auto mx-auto mb-4">
                <h1 class="text-center text-green-600 font-bold">GBEWA</h1>
                <p class="text-center text-xs">En fin la bonheur</p>
            </div>

            <!-- Sidebar Navigation -->
            <nav class="space-y-4">
                <a href="#" id="rhLink" class="sidebar-link block py-2 px-4 rounded-lg text-gray-700 bg-green-100">
                    <i class="fas fa-users mr-2"></i> Ressources Humaines
                </a>
                <a href="#" id="financesLink" class="sidebar-link block py-2 px-4 rounded-lg text-gray-700 hover:bg-green-100">
                    <i class="fas fa-wallet mr-2"></i> Finances
                </a>
                <a href="#" id="complaintsLink" class="sidebar-link block py-2 px-4 rounded-lg text-gray-700 hover:bg-green-100">
                    <i class="fas fa-comment-dots mr-2"></i> Plainte & Suggestions
                </a>
                <a href="#" id="statsLink" class="sidebar-link block py-2 px-4 rounded-lg text-gray-700 hover:bg-green-100">
                    <i class="fas fa-chart-bar mr-2"></i> Statistiques
                </a>
                <a href="#" id="docsLink" class="sidebar-link block py-2 px-4 rounded-lg text-gray-700 hover:bg-green-100">
                    <i class="fas fa-book mr-2"></i> Documentation
                </a>
                <a href="#" id="settingsLink" class="sidebar-link block py-2 px-4 rounded-lg text-gray-700 hover:bg-green-100">
                    <i class="fas fa-cogs mr-2"></i> Paramètres
                </a>
            </nav>
        </aside>

        <!-- Main Content Wrapper -->
        <div class="flex-1 p-6">
            <!-- Main Content (Ressources Humaines, initially visible) -->
            <main id="mainContent">
                <header class="bg-white shadow p-6">
                    <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
                        <!-- Employés with functional link (green default class) -->
                        <a id="employeesLink" href="{{ route('employees.index') }}" class="main-content-link block bg-green-500 text-white p-6 rounded-lg shadow-lg text-center">
                            <div class="text-3xl font-bold">6.187</div>
                            <div class="mt-2">Employés</div>
                        </a>
                        <!-- Rapports without link -->
                        <div class="block bg-white text-green-600 p-6 rounded-lg shadow-lg text-center border border-gray-200">
                            <div class="text-3xl font-bold">4.732</div>
                            <div class="mt-2">Rapports</div>
                        </div>
                        <!-- Demandes with functional link -->
                        <a id="requestsLink" href="{{ route('requests.show') }}" class="main-content-link block bg-white text-green-600 p-6 rounded-lg shadow-lg text-center border border-gray-200">
                            <div class="text-3xl font-bold">07</div>
                            <div class="mt-2">Demandes</div>
                        </a>
                        <!-- Formations with functional link -->
                        <a id="trainingsLink" href="{{ route('trainings.create') }}" class="main-content-link block bg-white text-green-600 p-6 rounded-lg shadow-lg text-center border border-gray-200">
                            <div class="text-3xl font-bold">3.275</div>
                            <div class="mt-2">Formations</div>
                        </a>
                    </div>
                </header>
                <!-- Main content area for dynamic sections -->
                <div class="mt-8">
                    @yield('content')
                </div>
            </main>

            <!-- Finances Section -->
            <section id="financeContent" class="hidden">
                <div class="bg-white shadow p-6">
                    <div class="text-3xl font-bold mb-4">Gestion des Finances</div>
                    <div class="flex items-center">
                        <!-- Div for Fiche d'Engagement -->
                        <div class="bg-gray-200 text-gray-700 py-2 px-4 rounded mr-2" id="ficheEngagementDiv">
                            <a href="{{ route('engagement.page') }}" class="text-gray-700" id="ficheEngagementLink">
                                <i class="fas fa-file-contract"></i> Fiche d’Engagement
                            </a>
                        </div>
                        <!-- Div for Demande de Paiement -->
                        <div class="bg-gray-200 text-gray-700 py-2 px-4 rounded mr-2" id="demandePaiementDiv">
                            <a href="{{ route('payments.page') }}" class="text-gray-700" id="demandePaiementLink">
                                <i class="fas fa-file-invoice-dollar"></i> Demande de Paiement
                            </a>
                        </div>
                        <!-- Div for Ordre de Paiement -->
                        <div class="bg-gray-200 text-gray-700 py-2 px-4 rounded" id="ordrePaiementDiv">
                            <a href="{{ route('orderpayment.page2') }}" class="text-gray-700" id="ordrePaiementLink">
                                <i class="fas fa-money-check-alt"></i> Ordre de Paiement
                            </a>
                        </div>
                    </div>
                    <!-- Intégration du contenu dynamique -->
                    <div class="mt-8">
                        @yield('financeContent')
                    </div>
                </div>
            </section>

            <!-- Other Sections (Complaints, Statistics, etc.) -->
            <section id="complaintsContent" class="hidden">
                <div class="bg-white shadow p-6">
                    <div class="text-3xl font-bold mb-4">Bienvenue à la page des Plaintes & Suggestions</div>
                </div>
            </section>
            <section id="statsContent" class="hidden">
                <div class="bg-white shadow p-6">
                    <div class="text-3xl font-bold mb-4">Bienvenue à la page des Statistiques</div>
                </div>
            </section>
            <section id="docsContent" class="hidden">
                <div class="bg-white shadow p-6">
                    <div class="text-3xl font-bold mb-4">Bienvenue à la page de Documentation</div>
                </div>
            </section>
            <section id="settingsContent" class="hidden">
                <div class="bg-white shadow p-6">
                    <div class="text-3xl font-bold mb-4">Bienvenue à la page des Paramètres</div>
                </div>
            </section>
        </div>

    </div>

    <!-- Scripts React -->
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])

    <!-- Script to handle active link highlighting based on URL -->
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // Sidebar Links
            const sidebarLinks = {
                rhLink: document.getElementById('rhLink'),
                financesLink: document.getElementById('financesLink'),
                complaintsLink: document.getElementById('complaintsLink'),
                statsLink: document.getElementById('statsLink'),
                docsLink: document.getElementById('docsLink'),
                settingsLink: document.getElementById('settingsLink')
            };

            const sections = {
                mainContent: document.getElementById('mainContent'),
                financeContent: document.getElementById('financeContent'),
                complaintsContent: document.getElementById('complaintsContent'),
                statsContent: document.getElementById('statsContent'),
                docsContent: document.getElementById('docsContent'),
                settingsContent: document.getElementById('settingsContent')
            };

            // Function to hide all sections
            function hideAllSections() {
                for (let key in sections) {
                    sections[key].style.display = 'none';
                }
            }

            // Function to remove active classes from sidebar
            function clearSidebarActiveClasses() {
                for (let key in sidebarLinks) {
                    sidebarLinks[key].classList.remove('bg-green-100', 'text-gray-700');
                    sidebarLinks[key].classList.add('text-gray-700', 'hover:bg-green-100');
                }
            }

            // Add click event listeners to sidebar links
            for (let key in sidebarLinks) {
                sidebarLinks[key].addEventListener('click', function (e) {
                    e.preventDefault();
                    hideAllSections();
                    clearSidebarActiveClasses();
                    this.classList.remove('hover:bg-green-100');
                    this.classList.add('bg-green-100', 'text-gray-700');
                    
                    // Show corresponding section
                    switch(key) {
                        case 'rhLink':
                            sections.mainContent.style.display = 'block';
                            break;
                        case 'financesLink':
                            sections.financeContent.style.display = 'block';
                            break;
                        case 'complaintsLink':
                            sections.complaintsContent.style.display = 'block';
                            break;
                        case 'statsLink':
                            sections.statsContent.style.display = 'block';
                            break;
                        case 'docsLink':
                            sections.docsContent.style.display = 'block';
                            break;
                        case 'settingsLink':
                            sections.settingsContent.style.display = 'block';
                            break;
                    }
                });
            }

            // Main Content Links (employees, requests, trainings)
            const mainContentLinks = document.querySelectorAll('.main-content-link');

            // Function to remove active classes from main content links
            function clearMainContentActiveClasses() {
                mainContentLinks.forEach(link => {
                    link.classList.remove('bg-green-500', 'text-white');
                    link.classList.add('bg-white', 'text-green-600');
                });
            }

            // Function to set active class based on current path
            function setActiveMainContentLink() {
                clearMainContentActiveClasses();
                const currentPath = window.location.pathname;

                if (currentPath.includes('employees')) {
                    const link = document.getElementById('employeesLink');
                    if (link) {
                        link.classList.add('bg-green-500', 'text-white');
                        link.classList.remove('bg-white', 'text-green-600');
                    }
                } else if (currentPath.includes('requests')) {
                    const link = document.getElementById('requestsLink');
                    if (link) {
                        link.classList.add('bg-green-500', 'text-white');
                        link.classList.remove('bg-white', 'text-green-600');
                    }
                } else if (currentPath.includes('trainings')) {
                    const link = document.getElementById('trainingsLink');
                    if (link) {
                        link.classList.add('bg-green-500', 'text-white');
                        link.classList.remove('bg-white', 'text-green-600');
                    }
                } else {
                    // Default to employees if no match
                    const link = document.getElementById('employeesLink');
                    if (link) {
                        link.classList.add('bg-green-500', 'text-white');
                        link.classList.remove('bg-white', 'text-green-600');
                    }
                }
            }

            // Initial setup based on URL
            hideAllSections();
            clearSidebarActiveClasses();
            setActiveMainContentLink();

            // Show the appropriate section based on URL
            const currentPath = window.location.pathname;

            if (currentPath.includes('employees') || currentPath.includes('requests') || currentPath.includes('trainings')) {
                sections.mainContent.style.display = 'block';
            } else if (currentPath.includes('payments') || currentPath.includes('orderpayment') || currentPath.includes('engagement')) {
                sections.financeContent.style.display = 'block';
                const financesLink = document.getElementById('financesLink');
                if (financesLink) {
                    financesLink.classList.add('bg-green-100', 'text-gray-700');
                    financesLink.classList.remove('hover:bg-green-100');
                }

                // Optionnel : Ajouter une classe active au lien spécifique si nécessaire
                if (currentPath.includes('payments')) {
                    const demandePaiementDiv = document.getElementById('demandePaiementDiv');
                    if (demandePaiementDiv) {
                        demandePaiementDiv.classList.add('bg-green-500', 'text-white');
                        const demandePaiementLink = document.getElementById('demandePaiementLink');
                        demandePaiementLink.classList.add('text-white');
                        demandePaiementDiv.classList.remove('bg-gray-200', 'text-gray-700');
                    }
                } else if (currentPath.includes('orderpayment')) {
                    const ordrePaiementDiv = document.getElementById('ordrePaiementDiv');
                    if (ordrePaiementDiv) {
                        ordrePaiementDiv.classList.add('bg-green-500', 'text-white');
                        const ordrePaiementLink = document.getElementById('ordrePaiementLink');
                        ordrePaiementLink.classList.add('text-white');
                        ordrePaiementDiv.classList.remove('bg-gray-200', 'text-gray-700');
                    }
                } else if (currentPath.includes('engagement')) {
                    const ficheEngagementDiv = document.getElementById('ficheEngagementDiv');
                    if (ficheEngagementDiv) {
                        ficheEngagementDiv.classList.add('bg-green-500', 'text-white');
                        const ficheEngagementLink = document.getElementById('ficheEngagementLink');
                        ficheEngagementLink.classList.add('text-white');
                        ficheEngagementDiv.classList.remove('bg-gray-200', 'text-gray-700');
                    }
                }
            } else {
                // By default, display the mainContent section and activate RH link
                sections.mainContent.style.display = 'block';
                const rhLink = document.getElementById('rhLink');
                if (rhLink) {
                    rhLink.classList.add('bg-green-100', 'text-gray-700');
                    rhLink.classList.remove('hover:bg-green-100');
                }
            }
        });
    </script>

</body>
</html>
