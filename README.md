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
<p>Ainsi, le covoiturage est bénéfique pour la planète et pour la société.</p>

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


