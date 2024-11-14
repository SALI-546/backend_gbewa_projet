import React from 'react';
import { FaTimes } from 'react-icons/fa';

const TrainingDetails = ({ training, closeModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white shadow-lg rounded-lg w-1/2 p-6 relative">
        {/* Icone de fermeture */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          onClick={closeModal}
        >
          <FaTimes className="text-lg" />
        </button>

        {/* Titre */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Formation</h2>
        </div>

        {/* Détails de la formation */}
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Intitulé de la formation</label>
          <p className="text-gray-700">{training.title}</p>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Cible</label>
          <p className="text-gray-700">{training.target}</p>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Date prévisionnelle</label>
          <p className="text-gray-700">{training.date}</p>
        </div>

        {/* Bouton de fermeture */}
        <div className="text-right">
          <button
            onClick={closeModal}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Fermé
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingDetails;
