const colombiaData = {
    "Amazonas": ["Leticia", "Puerto Nariño", "El Encanto", "La Chorrera", "La Pedrera", "La Victoria", "Mirití-Paraná", "Puerto Alegria", "Puerto Arica", "Puerto Santander", "Tarapacá"],
    "Antioquia": ["Medellín", "Bello", "Itagüí", "Envigado", "Apartadó", "Rionegro", "Turbo", "Caucasia", "Abejorral", "Abriaquí", "Alejandria", "Amagá", "Amalfi", "Andes", "Angelópolis", "Angostura", "Anorí", "Anzá", "Arboletes", "Argelia", "Armenia", "Barbosa", "Belmira", "Betania", "Betulia", "Briceño", "Buriticá", "Cáceres", "Caicedo", "Caldas", "Campamento", "Cañasgordas", "Caracolí", "Caramanta", "Carepa", "Carmen de Viboral", "Carolina", "Castilla la Nueva", "Caucasia", "Chigorodó", "Cisneros", "Ciudad Bolívar", "Cocorná", "Concepción", "Concordia", "Copacabana", "Dabeiba", "Don Matías", "Ebéjico", "El Bagre", "El Carmen de Viboral", "El Santuario", "Entrerríos", "Envigado", "Fredonia", "Frontino", "Giraldo", "Girardota", "Gómez Plata", "Granada", "Guadalupe", "Guarne", "Guatapé", "Heliconia", "Hispania", "Itagüí", "Ituango", "Jardín", "Jericó", "La Ceja", "La Estrella", "La Pintada", "La Unión", "Liborina", "Maceo", "Marinilla", "Montebello", "Murindó", "Mutatá", "Nariño", "Nechí", "Necoclí", "Olaya", "Peñol", "Peque", "Pueblorrico", "Puerto Berrío", "Puerto Nare", "Puerto Triunfo", "Remedios", "Retiro", "Rionegro", "Sabanalarga", "Sabaneta", "Salgar", "San Andrés de Cuerquia", "San Carlos", "San Francisco", "San Jerónimo", "San José de la Montaña", "San Juan de Urabá", "San Luis", "San Pedro de los Milagros", "San Pedro de Urabá", "San Rafael", "San Roque", "San Vicente", "Santa Bárbara", "Santa Rosa de Osos", "Santa Fe de Antioquia", "Santo Domingo", "Segovia", "Sonsón", "Sopetrán", "Támesis", "Tarazá", "Tarso", "Titiribí", "Toledo", "Turbo", "Uramita", "Urrao", "Valdivia", "Valparaíso", "Vegachí", "Venecia", "Vigía del Fuerte", "Yalí", "Yarumal", "Yolombó", "Yondó", "Zaragoza"],
    "Arauca": ["Arauca", "Tame", "Saravena", "Arauquita", "Cravo Norte", "Fortul", "Puerto Rondón"],
    "Atlántico": ["Barranquilla", "Soledad", "Malambo", "Puerto Colombia", "Baranoa", "Campo de la Cruz", "Candelaria", "Galapa", "Juan de Acosta", "Luruaco", "Palmar de Varela", "Piojó", "Polonuevo", "Ponedera", "Repelón", "Sabanagrande", "Sabanalarga", "Santa Lucía", "Santo Tomás", "Suan", "Tubará", "Usiacurí"],
    "Bolívar": ["Cartagena", "Magangué", "Turbaco", "Achí", "Altos del Rosario", "Arenal", "Arjona", "Arroyohondo", "Barranco de Loba", "Calamar", "Cantagallo", "Cicuco", "Clemencia", "Córdoba", "El Carmen de Bolívar", "El Guamo", "El Peñón", "Hatillo de Loba", "Lotes de Papayal", "Mahates", "Margarita", "Maria la Baja", "Mompós", "Montecristo", "Morales", "Pinillos", "Regidor", "Río Viejo", "San Cristóbal", "San Estanislao", "San Fernando", "San Jacinto", "San Jacinto del Cauca", "San Juan Nepomuceno", "San Martin de Loba", "San Pablo", "Santa Catalina", "Santa Rosa", "Santa Rosa del Sur", "Simití", "Soplaviento", "Talaigua Nuevo", "Tiquisio", "Turbana", "Villanueva", "Zambrano"],
    "Boyacá": ["Tunja", "Duitama", "Sogamoso", "Chiquinquirá", "Almeida", "Aquitania", "Arcabuco", "Belén", "Berbeo", "Betéitiva", "Boavita", "Boyacá", "Briceño", "Buenavista", "Busbanzá", "Caldas", "Campohermoso", "Cerinza", "Chinavita", "Chita", "Chivatá", "Chivor", "Ciénega", "Cómbita", "Coper", "Corrales", "Covarachía", "Cubará", "Cucaita", "Cuítiva", "Chíquiza", "El Cocuy", "El Espino", "Firavitoba", "Floresta", "Gachantivá", "Gámeza", "Garagoa", "Guacamayas", "Guateque", "Guayatá", "Güicán", "Iza", "Jenesano", "Jericó", "La Capilla", "La Victoria", "Labranzagrande", "Macanal", "Maripí", "Miraflores", "Mongua", "Monguí", "Moniquirá", "Motavita", "Muzo", "Nobsa", "Nuevo Colón", "Oicatá", "Otanche", "Pachavita", "Páez", "Paipa", "Pajarito", "Panqueba", "Pauna", "Paya", "Paz de Río", "Pesca", "Pisba", "Puerto Boyacá", "Quípama", "Ramiriquí", "Ráquira", "Rondón", "Saboyá", "Sáchica", "Samacá", "San Eduardo", "San José de Pare", "San Luis de Gaceno", "San Mateo", "San Miguel de Sema", "San Pablo de Borbur", "Santana", "Santa María", "Santa Rosa de Viterbo", "Santa Sofía", "Sativanorte", "Sativasur", "Siachoque", "Soatá", "Socha", "Socotá", "Somondoco", "Sora", "Soracá", "Sotaquirá", "Susacón", "Sutamarchán", "Sutatenza", "Tasco", "Tenza", "Tibaná", "Tibasosa", "Tinjacá", "Tipacoque", "Toca", "Togüí", "Tópaga", "Tota", "Tununguá", "Turmequé", "Tuta", "Tutazá", "Úmbita", "Ventaquemada", "Villa de Leyva", "Viracachá", "Zetaquira"],
    "Caldas": ["Manizales", "La Dorada", "Riosucio", "Aguadas", "Anserma", "Aranzazu", "Belalcázar", "Chinchiná", "Filadelfia", "La Merced", "Manzanares", "Marmato", "Marquetalia", "Marulanda", "Neira", "Norcasia", "Pácora", "Palestina", "Pensilvania", "Risarálda", "Salamina", "Samaná", "San José", "Supía", "Victoria", "Villamaría", "Viterbo"],
    "Caquetá": ["Florencia", "San Vicente del Caguán", "Albania", "Belén de los Andaquíes", "Cartagena del Chairá", "Curillo", "El Doncello", "El Paujil", "La Montañita", "Milán", "Morelia", "Puerto Rico", "San José del Fragua", "Solano", "Solita", "Valparaíso"],
    "Casanare": ["Yopal", "Aguazul", "Villanueva", "Chámeza", "Hato Corozal", "La Salina", "Maní", "Monterrey", "Nunchía", "Orocué", "Paz de Ariporo", "Pore", "Recetor", "Sácama", "San Luis de Palenque", "Támara", "Tauramena", "Trinidad", "Zapatoca"],
    "Cauca": ["Popayán", "Santander de Quilichao", "Almaguer", "Argelia", "Balboa", "Bolívar", "Buenos Aires", "Cajibío", "Caldono", "Caloto", "Corinto", "El Tambo", "Florencia", "Guachené", "Guapí", "Inzá", "Jambaló", "La Sierra", "La Vega", "López de Micay", "Mercaderes", "Miranda", "Morales", "Padilla", "Páez", "Patía", "Piamonte", "Piendamó", "Puerto Tejada", "Puracé", "Rosas", "San Sebastián", "Santa Rosa", "Silvia", "Sotará", "Suárez", "Sucre", "Timbiquí", "Timbío", "Toribío", "Totoró", "Villarrica"],
    "Cesar": ["Valledupar", "Aguachica", "Codazzi", "Astrea", "Becerril", "Bosconia", "Chimichagua", "Chiriguaná", "Curumaní", "El Copey", "El Paso", "Gamarra", "González", "La Gloria", "La Jagua de Ibirico", "La Paz", "Manaure Balcón del Cesar", "Pailitas", "Pelaya", "Pueblo Bello", "Río de Oro", "San Alberto", "San Diego", "San Martín", "Tamalameque"],
    "Chocó": ["Quibdó", "Istmina", "Acandí", "Alto Baudó", "Atrato", "Bagadó", "Bahía Solano", "Bajo Baudó", "Bojayá", "Cantón de San Pablo", "Carmen del Darién", "Cértegui", "Condoto", "El Carmen de Atrato", "El Litoral del San Juan", "Istmina", "Juradó", "Lloró", "Medio Atrato", "Medio Baudó", "Medio San Juan", "Nóvita", "Nuquí", "Pacífico", "Río Iró", "Río Quito", "Riosucio", "San José del Palmar", "Sipí", "Tadó", "Unguía", "Unión Panamericana"],
    "Córdoba": ["Montería", "Cereté", "Sahagún", "Lorica", "Ayapel", "Buenavista", "Canalete", "Chimá", "Chinú", "Ciénaga de Oro", "Cotorra", "La Apartada", "Los Córdobas", "Momil", "Montelíbano", "Moñitos", "Planeta Rica", "Pueblo Nuevo", "Puerto Escondido", "Puerto Libertador", "Purísima", "San Andrés de Sotavento", "San Antero", "San Bernardo del Viento", "San Carlos", "San José de Uré", "San Pelayo", "Tierralta", "Tuchín", "Valencia"],
    "Cundinamarca": ["Bogotá", "Soacha", "Chía", "Zipaquirá", "Facatativá", "Fusagasugá", "Girardot", "Mosquera", "Madrid", "Agua de Dios", "Albán", "Anapoima", "Anolaima", "Apulo", "Arbeláez", "Beltrán", "Bituima", "Bojacá", "Cabrera", "Cachipay", "Cajicá", "Caparrapí", "Cáqueza", "Carmen de Carupa", "Chaguaní", "Chipaque", "Choachí", "Chocontá", "Cogua", "Cota", "Cucunubá", "El Colegio", "El Peñón", "El Rosal", "Fomeque", "Fosca", "Funza", "Fúquene", "Gachalá", "Gachancipá", "Gachetá", "Gama", "Granada", "Guachetá", "Guaduas", "Guasca", "Guataquí", "Guatavita", "Guayabal de Síquima", "Guayabetal", "Gutiérrez", "Jerusalén", "Junín", "La Calera", "La Mesa", "La Palma", "La Peña", "La Vega", "Lenguazaque", "Machetá", "Manta", "Medina", "Nariño", "Nemocón", "Nilo", "Nimaima", "Nocaima", "Pacho", "Paime", "Pandi", "Paratebueno", "Pasca", "Puerto Salgar", "Pulí", "Quebradanegra", "Quetame", "Quipile", "Ricaurte", "San Antonio del Tequendama", "San Bernardo", "San Cayetano", "San Francisco", "San Juan de Rioseco", "Sasaima", "Sesquilé", "Sibaté", "Silvania", "Simijaca", "Sopó", "Subachoque", "Suesca", "Supatá", "Susa", "Sutatausa", "Tabio", "Tausa", "Tena", "Tenjo", "Tibacuy", "Tibirita", "Tocaima", "Tocancipá", "Topaipí", "Ubalá", "Ubaque", "Une", "Útica", "Venecia", "Viotá", "Yacopí", "Zipacón"],
    "Guainía": ["Inírida", "Barrancominas"],
    "Guaviare": ["San José del Guaviare", "Calamar", "El Retorno", "Miraflores"],
    "Huila": ["Neiva", "Pitalito", "Garzón", "Acevedo", "Agrado", "Aipe", "Algeciras", "Altamira", "Baraya", "Campoalegre", "Colombia", "Elías", "Gigante", "Guadalupe", "Hobo", "Íquira", "Isnos", "La Argentina", "La Plata", "Nátaga", "Oporapa", "Paicol", "Palermo", "Palestina", "Pital", "Rivera", "Saladoblanco", "San Agustín", "Santa María", "Suaza", "Tarqui", "Tello", "Teruel", "Tesalia", "Timaná", "Villavieja", "Yaguará"],
    "La Guajira": ["Riohacha", "Maicao", "Uribia", "Albania", "Barrancas", "Dibulla", "Distracción", "El Molino", "Fonseca", "Hatonuevo", "La Jagua del Pilar", "Manaure", "San Juan del Cesar", "Urumita", "Villanueva"],
    "Magdalena": ["Santa Marta", "Ciénaga", "Fundación", "Algarrobo", "Aracataca", "Ariguaní", "Cerro de San Antonio", "Chibolo", "Concordia", "El Banco", "El Piñón", "El Retén", "Guamal", "Nueva Granada", "Pedraza", "Pijiño del Carmen", "Pivijay", "Plato", "Puebloviejo", "Remolino", "Sabanas de San Ángel", "Salamina", "San Sebastián de Buenavista", "San Zenón", "Santa Ana", "Santa Bárbara de Pinto", "Sitionuevo", "Tenerife", "Zapayán", "Zona Bananera"],
    "Meta": ["Villavicencio", "Acacías", "Granada", "Barranca de Upía", "Cabuyaro", "Castilla la Nueva", "Cubarral", "Cumaral", "El Calvario", "El Castillo", "El Dorado", "Fuente de Oro", "Guamal", "La Macarena", "La Uribe", "Lejanías", "Mapiripán", "Mesetas", "Puerto Concordia", "Puerto Gaitán", "Puerto Lleras", "Puerto López", "Puerto Rico", "Restrepo", "San Carlos de Guaroa", "San Juan de Arama", "San Juanito", "San Martín", "Vistahermosa"],
    "Nariño": ["Pasto", "Ipiales", "Tumaco", "Albán", "Aldana", "Ancuya", "Arboleda", "Barbacoas", "Belén", "Buesaco", "Chachagüí", "Colón", "Consacá", "Contadero", "Córdoba", "Cuaspud", "Cumbal", "Cumbitara", "El Charco", "El Peñol", "El Rosario", "El Tablón de Gómez", "El Tambo", "Francisco Pizarro", "Funes", "Guachucal", "Guaitarilla", "Gualmatán", "Iles", "Imués", "La Cruz", "La Florida", "La Llanada", "La Ola", "La Unión", "Leiva", "Linares", "Los Andes", "Magüí Payán", "Mallama", "Mosquera", "Nariño", "Olaya Herrera", "Ospina", "Policarpa", "Potosí", "Puerres", "Pupiales", "Ricaurte", "Roberto Payán", "Samaniego", "Sandoná", "San Bernardo", "San Lorenzo", "San Pablo", "San Pedro de Cartago", "Santa Bárbara", "Santacruz", "Sapuyes", "Taminango", "Tangua", "Túquerres", "Yacuanquer"],
    "Norte de Santander": ["Cúcuta", "Ocaña", "Villa del Rosario", "Ábrego", "Arboledas", "Bochalema", "Bucarasica", "Cácota", "Cáchira", "Chinácota", "Chitagá", "Convención", "Cucutilla", "Durania", "El Carmen", "El Tarra", "El Zulia", "Gramalote", "Hacarí", "Herrán", "Labateca", "La Esperanza", "La Playa de Belén", "Los Patios", "Lourdes", "Mutiscua", "Pamplona", "Pamplonita", "Puerto Santander", "Ragonvalia", "Salazar", "San Calixto", "San Cayetano", "Santiago", "Sardinata", "Silos", "Teorama", "Tibú", "Toledo"],
    "Putumayo": ["Mocoa", "Puerto Asís", "Colón", "Orito", "Puerto Caicedo", "Puerto Guzmán", "Puerto Leguízamo", "San Francisco", "San Miguel", "Santiago", "Sibundoy", "Valle del Guamuez", "Villagarzón"],
    "Quindío": ["Armenia", "Calarcá", "Buenavista", "Circasia", "Córdoba", "Filandia", "Génova", "La Tebaida", "Montenegro", "Pijao", "Quimbaya", "Salento"],
    "Risaralda": ["Pereira", "Dosquebradas", "Santa Rosa de Cabal", "Apía", "Balboa", "Belén de Umbría", "Guática", "La Celia", "La Virginia", "Marsella", "Mistrató", "Pueblo Rico", "Quinchía", "Santuario"],
    "San Andrés y Providencia": ["San Andrés", "Providencia"],
    "Santander": ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta", "Barrancabermeja", "Aguada", "Albania", "Aratoca", "Barbosa", "Barichara", "Betulia", "Bolívar", "Cabrera", "California", "Capitanejo", "Carcasí", "Cepitá", "Cerrito", "Charalá", "Charta", "Chima", "Chipatá", "Cimitarra", "Concepción", "Confines", "Contratación", "Coromoro", "Curití", "El Carmen de Chucurí", "El Guacamayo", "El Peñon", "El Playón", "Encino", "Enciso", "Florián", "Galán", "Gámbita", "Guaca", "Guadalupe", "Guapotá", "Guavatá", "Güepsa", "Hato", "Jesús María", "Jordán", "La Belleza", "La Paz", "Landázuri", "Lebrija", "Los Santos", "Macaravita", "Málaga", "Matanza", "Mogotes", "Molagavita", "Ocamonte", "Oiba", "Onzaga", "Palmar", "Palmas del Socorro", "Páramo", "Pinchote", "Puente Nacional", "Puerto Parra", "Puerto Wilches", "Rionegro", "Sabana de Torres", "San Andrés", "San Benito", "San Gil", "San Joaquín", "San José de Miranda", "San Miguel", "San Vicente de Chucurí", "Santa Bárbara", "Santa Helena del Opón", "Simacota", "Socorro", "Suaita", "Sucre", "Suratá", "Tona", "Valle de San José", "Vélez", "Vetas", "Villanueva", "Zapatoca"],
    "Sucre": ["Sincelejo", "Corozal", "Buenavista", "Caimito", "Chalán", "Colosó", "Coveñas", "El Roble", "Galeras", "Guaranda", "La Unión", "Los Palmitos", "Majagual", "Morroa", "Ovejas", "Palmito", "Sampués", "San Benito Abad", "San Juan de Betulia", "San Marcos", "San Onofre", "San Pedro", "Santiago de Tolú", "Sincé", "Tolú Viejo"],
    "Tolima": ["Ibagué", "Espinal", "Alpujarra", "Alvarado", "Ambalema", "Anzoátegui", "Armero Guayabal", "Ataco", "Cajamarca", "Carmen de Apicalá", "Casabianca", "Chaparral", "Coello", "Coyaima", "Cunday", "Dolores", "Falan", "Flandes", "Fresno", "Guamo", "Herveo", "Honda", "Icononzo", "Lérida", "Líbano", "Melgar", "Murillo", "Natagaima", "Ortega", "Palocabildo", "Piedras", "Planadas", "Prado", "Purificación", "Rioblanco", "Roncesvalles", "Rovira", "Saldaña", "San Antonio", "San Luis", "Santa Isabel", "Suárez", "Valle de San Juan", "Venadillo", "Villahermosa", "Villarrica"],
    "Valle del Cauca": ["Cali", "Buenaventura", "Palmira", "Tuluá", "Yumbo", "Cartago", "Buga", "Jamundí", "Alcalá", "Andalucía", "Ansermanuevo", "Argelia", "Bolívar", "Bugalagrande", "Caicedonia", "Calima", "Candelaria", "Dagua", "El Cairo", "El Cerrito", "El Dovio", "Florida", "Ginebra", "Guacarí", "La Cumbre", "La Unión", "La Victoria", "Obando", "Pradera", "Restrepo", "Riofrío", "Roldanillo", "San Pedro", "Sevilla", "Toro", "Trujillo", "Ulloa", "Versalles", "Vijes", "Yotoco", "Zarzal"],
    "Vaupés": ["Mitú", "Carurú", "Pacoa", "Papunahua", "Taraira", "Yavaraté"],
    "Vichada": ["Puerto Carreño", "Cumaribo", "La Primavera", "Santa Rosalía"]
};

function initCartLogic() {
    initTheme();
    if (!document.getElementById('searchModal')) {
        const searchModalHTML = `
<div id="searchModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] transition-opacity duration-300 opacity-0 pointer-events-none flex items-center justify-center p-4">
    <div id="searchModalContent" class="bg-background-light dark:bg-background-dark w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform scale-95 transition-transform duration-300">
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 italic">Buscar en Maleiwa</h3>
                <button onclick="closeSearchModal()" class="text-slate-500 hover:text-primary transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="relative">
                <input type="text" id="searchInput" placeholder="¿Qué estás buscando?" 
                    class="w-full px-5 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-lg"
                    onkeyup="if(event.key==='Enter') executeSearch()">
                <button onclick="executeSearch()" class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                    <span class="material-symbols-outlined">search</span>
                </button>
            </div>
            <p class="text-xs text-slate-500 mt-4 text-center">Presiona Enter para buscar</p>
        </div>
    </div>
</div>
        `;
        document.body.insertAdjacentHTML('beforeend', searchModalHTML);
    }

    if (!document.getElementById('orderModal')) {
        const orderModalHTML = `
<div id="orderModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] transition-opacity duration-300 opacity-0 pointer-events-none flex items-center justify-center p-4">
    <div id="orderModalContent" class="bg-background-light dark:bg-background-dark w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden transform scale-95 transition-transform duration-300 flex flex-col max-h-[90vh]">
        <div class="px-6 py-5 border-b border-primary/10 flex items-center justify-between bg-primary/5 text-slate-900 dark:text-slate-100 shrink-0 sticky top-0 z-20 backdrop-blur-sm">
            <h3 class="text-xl font-bold">Datos de Envío</h3>
            <button onclick="closeOrderModal()" class="w-10 h-10 flex items-center justify-center hover:bg-primary/10 rounded-full transition-colors text-slate-500">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <form id="orderForm" class="p-6 overflow-y-auto space-y-4 no-scrollbar text-left text-slate-900 dark:text-slate-100" onsubmit="processOrder(event)">
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nombre Completo</label>
                    <input type="text" required name="fullName" class="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary">
                </div>
                <div class="col-span-2 sm:col-span-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Tipo de Documento</label>
                    <select required name="idType" class="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary text-sm">
                        <option value="" disabled selected>Seleccionar...</option>
                        <option value="Cédula de Ciudadanía">Cédula de Ciudadanía (CC)</option>
                        <option value="Tarjeta de Identidad">Tarjeta de Identidad (TI)</option>
                        <option value="Pasaporte">Pasaporte (PAS)</option>
                        <option value="Cédula de Extranjería">Cédula de Extranjería (CE)</option>
                    </select>
                </div>
                <div class="col-span-2 sm:col-span-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Número Identificación</label>
                    <input type="text" required name="idNumber" class="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary">
                </div>
                <div class="col-span-2 sm:col-span-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Teléfono móvil</label>
                    <input type="tel" required name="phone" class="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary">
                </div>
                <div class="col-span-2 sm:col-span-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Departamento</label>
                    <select required name="department" id="deptSelect" onchange="updateCities()" class="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary text-sm">
                        <option value="">Seleccionar...</option>
                    </select>
                </div>
                <div class="col-span-2 sm:col-span-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Ciudad / Municipio</label>
                    <select required name="city" id="citySelect" class="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary text-sm">
                        <option value="">Seleccionar depto...</option>
                    </select>
                </div>
                <div class="col-span-2">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Dirección Exacta</label>
                    <input type="text" required name="address" class="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary" placeholder="Calle, Carrera, Apto, Barrio...">
                </div>
                <div class="col-span-2">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Medio de Pago</label>
                    <select required name="paymentMethod" class="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary text-sm">
                        <option value="">Seleccionar...</option>
                        <option value="Nequi">Nequi</option>
                        <option value="Daviplata">Daviplata</option>
                        <option value="Bancolombia">Bancolombia</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
            </div>
            <div class="pt-4 shrink-0">
                <button type="submit" class="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95 flex items-center justify-center gap-2">
                    Finalizar Compra
                    <span class="material-symbols-outlined text-sm font-bold">shopping_cart_checkout</span>
                </button>
            </div>
        </form>
    </div>
</div>

<style>
    /* Fix for toast overlapping on mobile */
    .toast-container {
        top: 10px !important;
        right: 10px !important;
        left: 10px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-end !important;
        gap: 8px !important;
        z-index: 99999 !important;
    }
    @media (max-width: 640px) {
        .toast-container {
            align-items: center !important;
        }
        .toast {
            width: 90% !important;
            max-width: none !important;
            padding: 12px 16px !important;
            margin-bottom: 0 !important;
            transform: translateY(-20px) !important;
            transition: all 0.3s ease !important;
            position: relative !important;
            right: auto !important;
            top: auto !important;
        }
        .toast.show {
            transform: translateY(0) !important;
        }
        #orderModal {
            align-items: flex-end !important;
            padding: 0 !important;
        }
        #orderModalContent {
            max-height: 85svh !important;
            max-height: 85dvh !important;
            width: 100% !important;
            margin: 0 !important;
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
            border-top-left-radius: 2rem !important;
            border-top-right-radius: 2rem !important;
            position: relative !important;
            padding-bottom: env(safe-area-inset-bottom, 24px) !important;
        }
        #orderForm {
            padding-bottom: 4rem !important;
        }
    }
    
    /* Ensure selects have enough space */
    select {
        appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 1em;
    }
    /* Fly to cart animation */
    .fly-item {
        position: fixed;
        z-index: 9999;
        pointer-events: none;
        object-fit: cover;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.8s ease-in-out;
    }
</style>
        `;
        document.body.insertAdjacentHTML('beforeend', orderModalHTML);
        populateDepts();

        // Ensure modal closing works with Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeOrderModal();
        });

        // Close on backdrop click
        document.getElementById('orderModal').addEventListener('click', (e) => {
            if (e.target.id === 'orderModal') closeOrderModal();
        });
    }
}

// Bridge function to be used by other pages to trigger the fly animation
window.triggerCartAdd = function (item, cartItem) {
    // 1. Save to local storage
    const cart = (typeof getCart === 'function') ? getCart() : [];
    cart.push(cartItem);
    saveCart(cart);

    // 2. Trigger micro-animation!
    if (typeof window.animateFlyToCart === 'function') {
        window.animateFlyToCart(item.image);
    }

    // 3. UI Feedback
    if (typeof closeSizeColorModal === 'function') closeSizeColorModal();
    if (typeof showToast === 'function') showToast(`${item.name} añadido`);
}


function populateDepts() {
    const select = document.getElementById('deptSelect');
    if (!select) return;
    Object.keys(colombiaData).sort().forEach(dept => {
        const opt = document.createElement('option');
        opt.value = dept;
        opt.textContent = dept;
        select.appendChild(opt);
    });
}

function updateCities() {
    const dept = document.getElementById('deptSelect').value;
    const citySelect = document.getElementById('citySelect');
    citySelect.innerHTML = '<option value="">Seleccionar...</option>';
    if (dept && colombiaData[dept]) {
        colombiaData[dept].sort().forEach(city => {
            const opt = document.createElement('option');
            opt.value = city;
            opt.textContent = city;
            citySelect.appendChild(opt);
        });
    }
}

function openOrderModal() {
    const modal = document.getElementById('orderModal');
    const content = document.getElementById('orderModalContent');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    content.classList.remove('scale-95');
    content.classList.add('scale-100');
    if (typeof closeCartModal === 'function') closeCartModal();
}

function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    const content = document.getElementById('orderModalContent');
    modal.classList.add('opacity-0', 'pointer-events-none');
    content.classList.add('scale-95');
    content.classList.remove('scale-100');
}

// Global checkout override
window.checkout = function () {
    const cart = (typeof getCart === 'function') ? getCart() : [];
    if (!cart || cart.length === 0) {
        if (typeof showToast === 'function') showToast('Tu carrito está vacío.', 'info');
        else alert('Tu carrito está vacío.');
        return;
    }
    openOrderModal();
};

window.openSearch = function () {
    const modal = document.getElementById('searchModal');
    const content = document.getElementById('searchModalContent');
    const input = document.getElementById('searchInput');
    if (!modal) return;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    content.classList.remove('scale-95');
    content.classList.add('scale-100');
    setTimeout(() => input.focus(), 100);
};

window.closeSearchModal = function () {
    const modal = document.getElementById('searchModal');
    const content = document.getElementById('searchModalContent');
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    content.classList.add('scale-95');
    content.classList.remove('scale-100');
};

window.executeSearch = function () {
    const q = document.getElementById('searchInput').value;
    if (q && q.trim()) {
        window.location.href = `collection.html?q=${encodeURIComponent(q.trim())}`;
    }
};

window.processOrder = function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const customer = Object.fromEntries(formData.entries());
    const cart = (typeof getCart === 'function') ? getCart() : [];
    const total = cart.reduce((s, i) => s + (Number(i.price) * (i.qty || 1)), 0);

    const formatPrice = (p) => '$' + Math.floor(p).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    let text = 'Hola, quiero realizar la siguiente compra:\n\n';
    text += 'PRODUCTOS:\n';
    cart.forEach(item => {
        const details = (item.size || item.color) ? ` (${item.size || ''}${item.size && item.color ? ', ' : ''}${item.color || ''})` : '';
        text += `- ${item.qty}x ${item.name}${details} → ${formatPrice(Number(item.price) * item.qty)}\n`;
    });
    text += `\nTOTAL: ${formatPrice(total)}\n\n`;
    text += 'DATOS DEL CLIENTE:\n';
    text += `• Nombre: ${customer.fullName}\n`;
    text += `• Identificación: ${customer.idType} ${customer.idNumber}\n`;
    text += `• Teléfono: ${customer.phone}\n`;
    text += `• Ubicación: ${customer.city}, ${customer.department}\n`;
    text += `• Dirección: ${customer.address}\n`;
    text += `• Medio de pago: ${customer.paymentMethod}\n`;

    let phone = '573046601648';
    if (window.storeSettings) {
        phone = window.storeSettings.whatsapp1 || window.storeSettings.whatsapp || phone;
    }
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.location.href = waUrl;
};

window.animateFlyToCart = function (imgSrc) {
    const cartBtn = document.querySelector('#openCartBtn') || document.getElementById('cart-count');
    if (!cartBtn) return;

    const img = document.createElement('img');
    img.src = imgSrc;
    img.className = 'fly-item';

    // Initial position (center of screen since modal is open)
    const startX = window.innerWidth / 2 - 50;
    const startY = window.innerHeight / 2 - 50;

    img.style.left = startX + 'px';
    img.style.top = startY + 'px';
    img.style.width = '100px';
    img.style.height = '120px';
    img.style.opacity = '1';

    document.body.appendChild(img);

    // Destination
    const rect = cartBtn.getBoundingClientRect();
    const destX = rect.left + rect.width / 2 - 20;
    const destY = rect.top + rect.height / 2 - 20;

    // Trigger animation
    requestAnimationFrame(() => {
        img.style.transform = `translate(${destX - startX}px, ${destY - startY}px) scale(0.1)`;
        img.style.opacity = '0.5';
    });

    // Cleanup and visual feedback on cart icon
    setTimeout(() => {
        img.remove();
        cartBtn.classList.add('scale-125', 'text-primary');
        const count = document.getElementById('cart-count');
        if (count) count.classList.add('scale-150', 'text-primary');

        setTimeout(() => {
            cartBtn.classList.remove('scale-125', 'text-primary');
            if (count) count.classList.remove('scale-150', 'text-primary');
        }, 300);
    }, 800);
}

// Start injection
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartLogic);
} else {
    initCartLogic();
}

function initTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    // Optional: add a small sound or haptic feedback here if desired
}

window.toggleTheme = toggleTheme;
window.initTheme = initTheme;
