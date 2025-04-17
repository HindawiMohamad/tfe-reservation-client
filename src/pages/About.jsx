function About() {
    return (
      <div style={{ padding: "2rem", maxWidth: "900px", margin:"100px Auto" }}>
        <h2>🎯 Le but du site</h2>
        <p>
          ArtisanConnect est une plateforme qui met en relation des particuliers avec des artisans qualifiés dans leur région. 
          L’objectif est double : aider les clients à trouver rapidement un professionnel de confiance, et permettre aux artisans de 
          gagner en visibilité sans forcément posséder leur propre site internet.
        </p>
  
        <h2>💡 Comment le projet est né</h2>
        <p>
          Après avoir développé plusieurs sites web pour des artisans indépendants, une idée m’est venue : pourquoi ne pas 
          rassembler tous ces artisans au sein d’une seule plateforme ? Cela faciliterait la vie des personnes à la recherche 
          d’un service, tout en offrant aux artisans un espace pour se démarquer, créer leur profil, gérer leurs créneaux de disponibilité, 
          et être notés par leurs clients.
          <br /><br />
          Cette approche permet aussi une certaine mise en compétition saine entre les artisans d’un même domaine, encourageant 
          ainsi l’excellence et le service de qualité.
        </p>
  
        <h2>👨‍💻 Qui a développé ce site ?</h2>
        <img src="./src/assets/about.jpg" alt="about" style={{display:"flex"}} />
        <p>
          Je m'appelle Mohamad Hindawi, je suis développeur web passionné. Ce site a été conçu dans le cadre de mon TFF (Travail de Fin de Formation) 
          d'une formation en développement Fullstack JavaScript.
          <br />
          J’ai utilisé des technologies modernes comme <strong>React</strong>, <strong>Node.js</strong>, <strong>Express</strong> et <strong>MongoDB</strong>, 
          en suivant une logique API REST complète.
        </p>
  
        <h3>🛠️ Un projet réalisé avec :</h3>
        <ul>
          <li>💻 Moi-même, pour la conception, le design et le développement</li>
          <li>🤖 <strong>ChatGPT</strong>, pour me guider étape par étape quand j’étais bloqué</li>
          <li>🗂️ <strong>Trello</strong>, pour l’organisation des tâches</li>
          <li>🔧 <strong>Git + GitHub</strong>, pour le versionnage du code</li>
        </ul>
  
        <p style={{ marginTop: "2rem", fontStyle: "italic" }}>
          Merci à toutes les personnes et outils qui ont contribué, de près ou de loin, à la réalisation de ce projet 🙏
        </p>
      </div>
    );
  }
  
  export default About;
  