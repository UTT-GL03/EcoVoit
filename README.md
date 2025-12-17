<!-- EcoVoit -->
<h1>EcoVoit</h1>
<p>Une application web de covoiturage transparente sur l'empreinte environnementale des trajets et sur les alternatives existantes.</p>

<h2>Choix du Sujet</h2>
<p>
Le transport est une grande source de pollution. En France, il produit environ <strong>30 %</strong> des émissions de CO₂ (source : Ministère de la Transition écologique). La voiture individuelle est le plus gros pollueur, surtout pour les trajets domicile-travail et les déplacements réguliers. Beaucoup de ces trajets se font avec une seule personne, ce qui gaspille de l’énergie et pollue inutilement.
</p>
<p>
Le covoiturage est une solution intéressante : il permet de mettre moins de voitures sur les routes, de réduire les émissions par personne et de favoriser des transports plus écologiques.
</p>

<h2>Utilité sociale</h2>
<p>Le covoiturage n’a pas seulement un intérêt écologique, il est aussi utile socialement et économiquement :</p>
<ul>
  <li>Il favorise le partage et la convivialité, en permettant aux gens de se rencontrer.</li>
  <li>Il diminue le coût des trajets pour les automobilistes, car les frais de carburant et de péage sont partagés.</li>
  <li>Il aide à réduire les embouteillages et la saturation des routes.</li>
</ul>

<h2>Effets de la numérisation</h2>
<p>Les applications mobiles et web ont rendu le covoiturage plus facile et plus pratique. Les utilisateurs peuvent voir les trajets disponibles, réserver ou proposer un trajet en quelques clics et organiser des itinéraires pour éviter de parcourir trop de kilomètres.</p>
<p>Mais il faut rester vigilant :</p>
<ul>
  <li>Trop de petits trajets ou de détours peuvent augmenter la pollution.</li>
  <li>L’impact énergétique des serveurs et de l’application, même faible, doit être pris en compte.</li>
</ul>
<p>Le service EcoVoit doit donc réduire au maximum les émissions de CO₂ tout en étant utilisé de manière responsable et efficace.</p>

<h2>Comparaison de l'empreinte environnementale de différents services de covoiturage</h2>
<p>Nous avons utilisé l'extension <strong>Green IT - Analysis</strong> pour calculer les empreintes des différents services. Nous avons sélectionné 3 services de covoiturage pour les comparer :</p>
<ul>
  <li>BlaBlaCar</li>
  <li>Kombo</li>
  <li>TicTacTrip</li>
</ul>

<p>Nous avons créé un scénario d'utilisation sur les sites : d'abord charger la page d'accueil, puis chercher un trajet Paris-Lyon pour le jour-même, et ouvrir le premier covoiturage disponible. Voici les résultats que nous avons obtenus pour chaque site (moyenne des 3 pages) :</p>

<table>
  <tr>
    <th>Service</th>
    <th>Eco Index</th>
  </tr>
  <tr>
    <td>BlaBlaCar</td>
    <td>42,92</td>
  </tr>
  <tr>
    <td>Kombo</td>
    <td>32,95</td>
  </tr>
  <tr>
    <td>TicTacTrip</td>
    <td>40,47</td>
  </tr>
</table>

<p>On voit que les 3 services ont un score similaire, assez bas (en dessous de la moyenne).</p>

<h2>Mises à jour techniques : chargement dynamique des données</h2>
<p>Nous avons modifié la façon dont l'application charge les données d'exemple :</p>

<h3>Changements effectués</h3>
<ul>
  <li>Le fichier de données a été déplacé dans <code>frontend/public/sample_data.json</code></li>
  <li>Utilisation de <code>fetch()</code> pour charger les données au lieu d'un import statique</li>
  <li>Implémentation avec <code>useEffect</code> et <code>useState</code> de React</li>
</ul>

<h3>Explications du code</h3>
<p>Le composant principal utilise maintenant ces hooks React :</p>
<pre>
// État pour stocker les données
const [data, setData] = useState({ users: [], trips: [], bookings: [] });

// Effet pour charger les données au montage du composant
useEffect(() => {
fetch('/sample_data.json')
.then(response => response.json())
.then(json => setData(json));
}, []); // [] signifie "exécuter une seule fois au montage"

</pre>

<p>Pourquoi utiliser <code>useEffect</code> ?</p>
<ul>
  <li>Il permet d'exécuter du code après le rendu du composant</li>
  <li>Le tableau vide <code>[]</code> garantit que le fetch ne se fait qu'une fois</li>
  <li>C'est l'endroit idéal pour les appels API ou le chargement de données</li>
</ul>
<p>Pourquoi utiliser <code>fetch()</code> ?</p>
<p>
 fetch() permet de récupérer des données depuis un fichier ou une API de façon dynamique.
</p>
<h3>Impact sur les évaluations</h3>
<ul>
  <li>Le flux utilisateur reste le même pour les tests</li>
  <li>La version 6.0.0 d'EcoIndex App pose des problèmes avec les scénarios automatisés</li>
  <li>Recommandation : utiliser la version 5.6.0 pour les évaluations</li>
</ul>

<h2>Choix du modèle économique</h2>

<p>Notre application sera financé grâce aux commissions prises sur chaque trajet réservé. Nous incluerons également des publicités. Pour finir, nous aimerions toucher des financements publics (Etat, collectivités territoriales), en promouvant l'aspect écoresponsable et la prise en compte des enjeux environnementaux d'EcoVoit.</p>

<h2>Structure de l'application web</h2>

<p>Il y aura 5 types d'objets métier dans notre application web : </p>
<ul>
  <li>"/search?dep={ville}&arr={ville}&date={date}" : la page d'accueil permettant de chercher un trajet avec 3 paramètres à remplir: Ville de départ, ville d'arrivée, date. Par défaut les paramètres seront vides. après les avoir rempli, les trajets correspondants s'afficheront sous forme de liste</li>
  <li>"/trip?trip_id={id}" : La page s'affichant après avoir cliqué sur un trajet en particulier. Elle affichera les détails du trjets: Conducteur, heure de départ, lieu de départ exact, heure d'arrivée, véhicule.</li>
  <li>"/booking?trip_id={id}" : La page s'affichant après avoir cliqué sur le bouton permettant de réserver un trajet</li>
  <li>"/user?user_id={id}" : La page affichant le compte de l'utilisateur, avec ses informations personnelles : Nom, prénom, numéro de téléphone, adresse mail, véhicule.</li>
</ul>

<h2>Version 1.0.1 : Mesure de l'impact environnemental</h2>

<p>Les mesures ont été réalisées grâce à l'extension EcoIndex.</p>

<table>
  <thead>
    <tr>
      <th></th>
      <th>Nombre de requêtes</th>
      <th>Taille de la page (Ko)</th>
      <th>Taille du DOM</th>
      <th>GES (gCO2e)</th>
      <th>Eau (cl)</th>
      <th>EcoIndex</th>
      <th>Note</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Mode développement</strong></td>
      <td>24</td>
      <td>1497</td>
      <td>102</td>
      <td>1.38</td>
      <td>2.08</td>
      <td>80.83</td>
      <td>A</td>
    </tr>
    <tr>
      <td><strong>Mode préproduction</strong></td>
      <td>9</td>
      <td>87</td>
      <td>99</td>
      <td>1.19</td>
      <td>1.79</td>
      <td>90.39</td>
      <td>A</td>
    </tr>
  </tbody>
</table>

<p>L'amélioration qu'on observe sur la version de préproduction par rapport à la version de développement s'explique par le processus de minification de React. Il réduit les tailles des noms de variable, supprime les espaces, commentaires, sauts de lignes, et il simplifie les expressions...</p>

<h2>Mesures de la consommation énergétique lors du passage à l'échelle</h2>

<p>Maintenant que notre prototype est fonctionnel, nous pouvons simuler les effets du "passage à l'échelle".</p>

<p>
Dans le cas qui nous occupe du covoiturage et dans le cadre des fonctionnalités envisagées (recherche et réservation de trajets), l'augmentation de la quantité des données à traiter ne viendra pas principalement de l'augmentation des fonctionnalités de la plateforme, mais bien de la croissance naturelle de sa base d'utilisateurs et de l'activité qu'ils génèrent.
</p>

<p>Les données qui se multiplient avec l'usage sont de trois types :</p>

<ul>
  <li><strong>Les utilisateurs</strong> : Chaque nouvelle inscription ajoute un profil avec avatar, historique de trajets et notes. À raison d'une croissance typique de 10-20 nouveaux utilisateurs par jour pour une plateforme régionale, nous passerions de 3 à environ 1000 utilisateurs en 3 à 6 mois.</li>
  
  <li><strong>Les trajets proposés</strong> : Chaque utilisateur actif propose en moyenne 2 trajets par mois. Avec 1000 utilisateurs dont 20% sont conducteurs réguliers, cela représente environ 400 nouveaux trajets par mois, soit 2000 trajets au bout de 5 mois.</li>
  
  <li><strong>Les réservations</strong> : Chaque trajet génère en moyenne 1,5 réservation. Avec 2000 trajets, nous atteignons donc 3000 réservations, dont seules les 50% les plus récentes (1500) sont conservées dans la base active pour l'affichage.</li>
</ul>

<p>
Cette exigence fonctionnelle bien que coûteuse du point de vue environnemental nous semble contribuer grandement à l'utilité sociale de la plateforme : permettre aux utilisateurs de consulter l'historique complet des trajets et des réservations est essentiel pour établir la confiance et la transparence nécessaires au bon fonctionnement d'une plateforme de covoiturage.
</p>

<p>
<strong>Par conséquent, nous avons simulé un passage à l'échelle avec un facteur multiplicateur d'environ ×333 pour les utilisateurs, ×667 pour les trajets et ×750 pour les réservations</strong>, ce qui correspond à une plateforme régionale mature après 5 à 6 mois d'activité.
</p>

<h3>Évolution de l'EcoIndex lors du passage à l'échelle</h3>

<p>Valeurs avant le passage à l'index : </p><br>

<table>
    <thead>
        <tr>
            <th>Étape</th>
            <th>EcoIndex</th>
            <th>Note</th>
            <th>Eau (cl)</th>
            <th>GES (gCO2e)</th>
            <th>Taille du DOM</th>
            <th>Requêtes</th>
            <th>Taille de la page (Ko)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Chargement de la page</td>
            <td>89</td>
            <td>A</td>
            <td>1.83</td>
            <td>1.22</td>
            <td>40</td>
            <td>3</td>
            <td>208.953</td>
        </tr>
        <tr>
            <td>Attendre le chargement de la page</td>
            <td>89</td>
            <td>A</td>
            <td>1.83</td>
            <td>1.22</td>
            <td>40</td>
            <td>5</td>
            <td>215.008</td>
        </tr>
        <tr>
            <td>Cliquer sur le premier bouton "Voir"</td>
            <td>89</td>
            <td>A</td>
            <td>1.83</td>
            <td>1.22</td>
            <td>29</td>
            <td>5</td>
            <td>215.008</td>
        </tr>
        <tr>
            <td>Consulter les détails du trajet</td>
            <td>89</td>
            <td>A</td>
            <td>1.83</td>
            <td>1.22</td>
            <td>29</td>
            <td>5</td>
            <td>215.008</td>
        </tr>
        <tr>
            <td>Attendre</td>
            <td>89</td>
            <td>A</td>
            <td>1.83</td>
            <td>1.22</td>
            <td>29</td>
            <td>5</td>
            <td>215.008</td>
        </tr>
        <tr>
            <td>Retourner à l'accueil via navigation</td>
            <td>89</td>
            <td>A</td>
            <td>1.83</td>
            <td>1.22</td>
            <td>40</td>
            <td>5</td>
            <td>215.008</td>
        </tr>
    </tbody>
</table>

<br><br>

<p>Valeurs après le passage à l'index : </p><br>

<table>
    <thead>
        <tr>
            <th>Étape</th>
            <th>EcoIndex</th>
            <th>Note</th>
            <th>Eau (cl)</th>
            <th>GES (gCO2e)</th>
            <th>Taille du DOM</th>
            <th>Requêtes</th>
            <th>Taille de la page (Ko)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Chargement de la page</td>
            <td>90</td>
            <td>A</td>
            <td>1.8</td>
            <td>1.2</td>
            <td>19</td>
            <td>3</td>
            <td>208.948</td>
        </tr>
        <tr>
            <td>Attendre le chargement de la page</td>
            <td>37</td>
            <td>D</td>
            <td>3.39</td>
            <td>2.26</td>
            <td>6036</td>
            <td>5</td>
            <td>1480.695</td>
        </tr>
        <tr>
            <td>Cliquer sur le premier bouton "Voir"</td>
            <td>83</td>
            <td>A</td>
            <td>2.01</td>
            <td>1.34</td>
            <td>29</td>
            <td>5</td>
            <td>1480.695</td>
        </tr>
        <tr>
            <td>Consulter les détails du trajet</td>
            <td>83 </td>
            <td>A</td>
            <td>2.01</td>
            <td>1.34</td>
            <td>29</td>
            <td>5</td>
            <td>1480.695</td>
        </tr>
        <tr>
            <td>Attendre</td>
            <td>83 </td>
            <td>A</td>
            <td>2.01</td>
            <td>1.34</td>
            <td>29</td>
            <td>5</td>
            <td>1480.695</td>
        </tr>
        <tr>
            <td>Retourner à l'accueil via navigation</td>
            <td>37</td>
            <td>D</td>
            <td>3.39</td>
            <td>2.26</td>
            <td>6036</td>
            <td>5</td>
            <td>1480.695</td>
        </tr>
    </tbody>
</table>

<p>On observe une déterioration de la performance sur les deux actions nécessitant de charger les données. Cela est dû à la taille beaucoup plus importante du dataset suite au passage à l'échelle. Sur les autres actions, la différence est minime.</p>

<h2>Version 2.0.0 : Données stockées dans une base de données</h2>

<p>Dans un but de réduction de l'impact environnemental, nous stockons à présent les données dans une base de données CouchDB. Nous filtrons les données qui nous intéressent du côté du serveur. </p>

<table>
  <thead>
    <tr>
      <th>Service</th>
      <th>CPU (s)</th>
      <th>Screen (s)</th>
      <th>Total Time (s)</th>
      <th>Memory (B)</th>
      <th>Disk (B)</th>
      <th>Network (B)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Navigateur</td>
      <td>0.0798</td>
      <td>17.7</td>
      <td>18.8</td>
      <td>1.24e+8</td>
      <td>0.00</td>
      <td>3.98e+5</td>
    </tr>
    <tr>
      <td>Serveur Web</td>
      <td>0.00137</td>
      <td>0.00</td>
      <td>18.4</td>
      <td>5.58e+6</td>
      <td>0.00</td>
      <td>5.80e+5</td>
    </tr>
    <tr>
      <td>Base de données</td>
      <td>0.0531</td>
      <td>0.00</td>
      <td>18.4</td>
      <td>8.78e+7</td>
      <td>0.00</td>
      <td>1.82e+5</td>
    </tr>
  </tbody>
</table>

<p>Ci-dessus, l'effet sur l'utilisation des ressources de l'introduction d'une base de données dans l'application, lors de la consultation des trajets</p>
<p>L’introduction de la base de données CouchDB a permis de mieux répartir la charge entre les différents services de la plateforme. Le navigateur reste le plus gourmand en ressources, avec une consommation élevée en CPU  et en mémoire, principalement due à l’affichage et au traitement des données. Le serveur web, en revanche, est très léger, ce qui montre une bonne optimisation côté backend. La base de données consomme davantage de mémoire que le serveur web, mais son impact sur le CPU reste modéré . Enfin, le réseau est assez peu solicité. Cela s'explique par le fait que les données soient chiffrées, ce qui les rend assez légères.</p>
<br>

<table>
  <thead>
    <tr>
      <th>Service</th>
      <th>CPU (Wh)</th>
      <th>Memory (Wh)</th>
      <th>Disk (Wh)</th>
      <th>Network (Wh)</th>
      <th>Screen (Wh)</th>
      <th>Total (Wh)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Navigateur</td>
      <td>0.0010</td>
      <td>0.000047</td>
      <td>0.0</td>
      <td>0.0020</td>
      <td>0.069</td>
      <td>0.072</td>
    </tr>
    <tr>
      <td>Serveur Web</td>
      <td>0.000024</td>
      <td>0.0000029</td>
      <td>0.0</td>
      <td>0.0030</td>
      <td>0.0</td>
      <td>0.0030</td>
    </tr>
    <tr>
      <td>Base de données</td>
      <td>0.00093</td>
      <td>0.000046</td>
      <td>0.0</td>
      <td>0.00093</td>
      <td>0.0</td>
      <td>0.0019</td>
    </tr>
  </tbody>
</table>

<p>Ci-dessus, l'effet sur la consommation énergétique de l'introduction d'une base de données dans l'application, lors de la consultation des trajets</p>
<p>D’un point de vue énergétique, le navigateur est de loin le plus coûteux, principalement à cause de l’écran, qui domine largement les autres postes de consommation. Le serveur web et la base de données, en revanche, ont un impact minimal. Cela confirme que l’essentiel de l’énergie est dépensée côté client, notamment lors de l’affichage et de l’interaction avec l’interface. Ces résultats soulignent l’importance d’optimiser le rendu côté navigateur pour réduire l’empreinte énergétique globale de la plateforme.</p>

<br><br>

<p>L’intégration de CouchDB a permis de centraliser et optimiser le traitement des données, réduisant ainsi la charge sur le navigateur et améliorant l’efficacité globale du système. Grâce à cette approche, la consommation énergétique et les ressources utilisées côté serveur restent très faibles, ce qui limite l’impact environnemental de la plateforme. Cependant, le navigateur reste le principal poste de consommation, notamment en raison de l’affichage et de la gestion des données. Cette nouvelle version représente donc une avancée significative vers une plateforme plus durable et scalable.</p>

<h2>Version 2.0.1 : Nouvelles fonctionnalités</h2>

<p>Afin d'améliorer l'expérience utilisateur, nous avons rajouté des fonctionnalités sur notre site web. Sur les détails d'un trajet, nous avons rajouté des informations sur l'impact environnemental du trajet, avec des comparaisons avec d'autres modes de transport (C02 economisé, comparaison avec train et voiture seul).<br>
Nous avons également rajouté un Tableau de Bord administrateur avec des informations diverses (nombre d'utilisateurs, de trajets, de réservations, quantité de CO2 économisée, trajets disponibles, taux de réservation, nombre de réservation par trajet. Il y a également un lien vers la page de la base de données CouchDB, ainsi qu'un bouton d'actualisation des données.</p>
<br>
<p>Nous avons ensuite mesuré l'impact environnemental de cette nouvelle version afin de voir l'évolution. Voici les valeurs que nous avons obtenu: </p><br><br>

<table>
  <thead>
    <tr>
      <th>Service</th>
      <th>CPU (s)</th>
      <th>Screen (s)</th>
      <th>Total Time (s)</th>
      <th>Memory (B)</th>
      <th>Disk (B)</th>
      <th>Network (B)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Navigateur</td>
      <td>0.0817</td>
      <td>17.7</td>
      <td>18.8</td>
      <td>1.26e+8</td>
      <td>0.00</td>
      <td>2.77e+5</td>
    </tr>
    <tr>
      <td>Serveur Web</td>
      <td>0.000330</td>
      <td>0.00</td>
      <td>18.4</td>
      <td>5.56e+6</td>
      <td>0.00</td>
      <td>2.83e+5</td>
    </tr>
    <tr>
      <td>Base de données</td>
      <td>0.0376</td>
      <td>0.00</td>
      <td>18.4</td>
      <td>8.91e+7</td>
      <td>0.00</td>
      <td>5.82e+3</td>
    </tr>
  </tbody>
</table>

<br>

<table>
  <thead>
    <tr>
      <th>Service</th>
      <th>CPU (Wh)</th>
      <th>Memory (Wh)</th>
      <th>Disk (Wh)</th>
      <th>Network (Wh)</th>
      <th>Screen (Wh)</th>
      <th>Total (Wh)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Navigateur</td>
      <td>0.0010</td>
      <td>0.000048</td>
      <td>0.0</td>
      <td>0.0014</td>
      <td>0.069</td>
      <td>0.072</td>
    </tr>
    <tr>
      <td>Serveur Web</td>
      <td>0.0000058</td>
      <td>0.0000029</td>
      <td>0.0</td>
      <td>0.0015</td>
      <td>0.0</td>
      <td>0.0015</td>
    </tr>
    <tr>
      <td>Base de données</td>
      <td>0.00066</td>
      <td>0.000046</td>
      <td>0.0</td>
      <td>0.000030</td>
      <td>0.0</td>
      <td>0.00073</td>
    </tr>
  </tbody>
</table>

<br>

<p>Comme on le voit, les nouvelles fonctionnalités ont un impact très limité. La consommation du Navigateur est inchangée, celle du Serveur Web baisse de 50%, et celle augmente de 300% (mais valeurs très faible donc insignifiantes). Il est donc raisonnable de les garder.</p>





