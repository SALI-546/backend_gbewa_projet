import React, { useState } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import TrainingForm from './TrainingForm';
import TrainingDetails from './TrainingDetails'; // Importer le composant des détails
import TrainingUpdate from './TrainingUpdate'; // Importer le composant pour la mise à jour

const TrainingList = () => {
  const [trainings, setTrainings] = useState([
    { id: 1, title: 'Utilisation de word', target: 'Secrétaires', date: '15-09-2024 14:30' },
    { id: 2, title: 'Microsoft Excel', target: 'Comptables', date: '04-10-2024 09:30' },
    { id: 3, title: 'Informatique', target: 'Tous les employés', date: '21-11-2024 12:00' },
  ]);

  const [showForm, setShowForm] = useState(false); // Gestion de l'affichage du formulaire
  const [selectedTraining, setSelectedTraining] = useState(null); // Pour stocker la formation sélectionnée
  const [showDetails, setShowDetails] = useState(false); // Pour afficher les détails
  const [showUpdate, setShowUpdate] = useState(false); // Pour afficher le formulaire de mise à jour
  const [startDate, setStartDate] = useState(''); // Date de début
  const [endDate, setEndDate] = useState(''); // Date de fin

  // Fonction pour afficher les détails d'une formation
  const handleView = (training) => {
    setSelectedTraining(training); // Stocker la formation sélectionnée
    setShowDetails(true); // Afficher les détails
  };

  // Fonction pour fermer le modal des détails
  const closeDetailsModal = () => {
    setShowDetails(false);
    setSelectedTraining(null);
  };

  // Fonction pour afficher le formulaire de mise à jour
  const handleEdit = (training) => {
    setSelectedTraining(training); // Stocker la formation à modifier
    setShowUpdate(true); // Afficher le formulaire de mise à jour
  };

  // Fonction pour fermer le modal de mise à jour
  const closeUpdateModal = () => {
    setShowUpdate(false);
    setSelectedTraining(null);
  };

  // Fonction pour supprimer une formation
  const handleDelete = (trainingId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      setTrainings(trainings.filter((training) => training.id !== trainingId));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center space-x-4 ml-auto"> {/* Utilisation de ml-auto pour aligner à droite */}
          {/* Conteneur gris pour la sélection des dates */}
          <div className="bg-gray-200 p-4 rounded-lg flex items-center space-x-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg text-lg px-4 py-2"
              placeholder="Date de début"
            />
            <span>-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg text-lg px-4 py-2"
              placeholder="Date de fin"
            />
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 text-white text-lg px-4 py-2 rounded-lg hover:bg-green-600" // Augmenter la taille du bouton
          >
            Ajouter +
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow text-lg"> {/* Augmentation de la taille du tableau */}
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">Intitulé de la formation</th>
              <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">Cible</th>
              <th className="py-3 px-6 text-center font-medium text-gray-600 border-r">Date prévisionnelle</th>
              <th className="py-3 px-6 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainings.map((training) => (
              <tr key={training.id} className="hover:bg-gray-100 border-b border-gray-200">
                <td className="py-3 px-6 text-center border-r">{training.title}</td>
                <td className="py-3 px-6 text-center border-r">{training.target}</td>
                <td className="py-3 px-6 text-center border-r">
                  {startDate && endDate ? `${startDate} - ${endDate}` : training.date}
                </td>
                <td className="py-3 px-6 text-center flex justify-center space-x-4">
                  <button className="text-gray-500 hover:text-gray-600" onClick={() => handleView(training)}>
                    <FaEye size={18} />
                  </button>
                  <button className="text-gray-500 hover:text-gray-600" onClick={() => handleEdit(training)}>
                    <FaEdit size={18} />
                  </button>
                  <button className="text-red-500 hover:text-red-600" onClick={() => handleDelete(training.id)}>
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Afficher le formulaire d'ajout si le bouton Ajouter est cliqué */}
      {showForm && <TrainingForm closeModal={() => setShowForm(false)} />}

      {/* Afficher les détails de la formation si l'icône FaEye est cliquée */}
      {showDetails && selectedTraining && (
        <TrainingDetails training={selectedTraining} closeModal={closeDetailsModal} />
      )}

      {/* Afficher le formulaire de mise à jour si l'icône FaEdit est cliquée */}
      {showUpdate && selectedTraining && (
        <TrainingUpdate training={selectedTraining} closeModal={closeUpdateModal} />
      )}
    </div>
  );
};

export default TrainingList;
