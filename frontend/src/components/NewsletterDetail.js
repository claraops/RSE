import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function NewsletterDetail() {
  const { id } = useParams(); // récupère l'ID dans l'URL
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/newsletters/${id}`);
        if (!res.ok) throw new Error("Erreur lors du chargement de la newsletter");
        const data = await res.json();
        setNewsletter(data);
      } catch (err) {
        console.error("❌ Erreur fetch newsletter :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, [id]);

  const handleSubscription = () => {
    setSubscribed(!subscribed);
    // 👉 Ici tu peux aussi envoyer une requête API pour sauvegarder l'abonnement/désabonnement
  };

  if (loading) return <p>⏳ Chargement...</p>;
  if (!newsletter) return <p>⚠️ Newsletter introuvable</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-6">
      <h1 className="text-2xl font-bold text-green-700 mb-2">
        {newsletter.titre}
      </h1>
      <p className="text-gray-500 text-sm mb-4">
        Publiée le {new Date(newsletter.date_publication).toLocaleDateString()}
      </p>
      <div className="text-gray-800 leading-relaxed mb-6">
        {newsletter.contenu}
      </div>

      <button
        onClick={handleSubscription}
        className={`px-4 py-2 rounded-lg font-medium ${
          subscribed ? "bg-red-500 text-white" : "bg-green-600 text-white"
        }`}
      >
        {subscribed ? "Se désabonner" : "S’abonner"}
      </button>
    </div>
  );
}
