import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const TrainingUpdate = ({ training, closeModal, updateTraining }) => {
  const [formData, setFormData] = useState({
    title: training.title,
    target: training.target,
    date: training.date,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de mise à jour de la formation
    updateTraining({ ...training, ...formData });
    closeModal(); // Fermer la modal après la mise à jour
  };

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
          <h2 className="text-2xl font-bold">Mettre à jour la formation</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Intitulé de la formation */}
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Intitulé de la formation</label>
            <input
              type="text"
              name="title"
              className="w-full border rounded-lg px-4 py-2"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Cible */}
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Cible</label>
            <input
              type="text"
              name="target"
              className="w-full border rounded-lg px-4 py-2"
              value={formData.target}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date prévisionnelle */}
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Date prévisionnelle</label>
            <input
              type="date"
              name="date"
              className="w-full border rounded-lg px-4 py-2"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Bouton de soumission */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainingUpdate;
