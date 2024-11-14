import React, { useState } from 'react';

const EmployeeForm = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    nom: '',
    beneficiaire: '',
    programmes: '',
    axeStrategique: '',
    chefDeProjet: '',
    debut: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to backend)
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Nouveau Projet</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="font-semibold">Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="border p-2 rounded-lg"
                placeholder="Alex Smith"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Bénéficiaire</label>
              <input
                type="text"
                name="beneficiaire"
                value={formData.beneficiaire}
                onChange={handleChange}
                className="border p-2 rounded-lg"
                placeholder="Alex Smith"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Programmes</label>
              <input
                type="text"
                name="programmes"
                value={formData.programmes}
                onChange={handleChange}
                className="border p-2 rounded-lg"
                placeholder="Alex Smith"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Axe Stratégique</label>
              <input
                type="text"
                name="axeStrategique"
                value={formData.axeStrategique}
                onChange={handleChange}
                className="border p-2 rounded-lg"
                placeholder="Alex Smith"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Chef de projet</label>
              <input
                type="text"
                name="chefDeProjet"
                value={formData.chefDeProjet}
                onChange={handleChange}
                className="border p-2 rounded-lg"
                placeholder="Alex Smith"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Début</label>
              <input
                type="date"
                name="debut"
                value={formData.debut}
                onChange={handleChange}
                className="border p-2 rounded-lg"
                placeholder="jj/mm/aaaa"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 rounded-lg"
                placeholder="Description here"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
