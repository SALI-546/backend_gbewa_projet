import React from 'react';

const RequestDetails = ({ request, closeModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg rounded-lg w-2/3 max-h-full overflow-auto p-6">
        {/* Title Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">Demande {request.id}</h2>
            <h3 className="text-xl text-gray-600 text-left">Demande d’évaluation du personnel</h3>
          </div>
          {request.status === 'Accepté' && (
            <div className="text-right">
              <span className="text-green-500 bg-green-100 px-2 py-1 rounded">Approuvé</span>
            </div>
          )}
        </div>

        {/* Request Information Section */}
        <div className="border-t pt-4 pb-4">
          <h4 className="text-lg font-semibold">Demandeur</h4>
          <p className="font-medium text-gray-600">{request.demandeur}</p>
        </div>

        <div className="border-t pt-4 pb-4">
          <h4 className="text-lg font-semibold">Qualité du demandeur</h4>
          <p className="text-gray-600">Chef Comptable et Logistique</p>
        </div>

        <div className="border-t pt-4 pb-4">
          <h4 className="text-lg font-semibold">Catégorie d’acteurs à évaluer</h4>
          <p className="text-gray-600">Assistants Comptable</p>
        </div>

        <div className="border-t pt-4 pb-4">
          <h4 className="text-lg font-semibold">Service ou département concerné</h4>
          <p className="text-gray-600">Finance</p>
        </div>

        <div className="border-t pt-4 pb-4">
          <h4 className="text-lg font-semibold">Employé concerné (pour les évaluations ciblées)</h4>
          <p className="text-gray-600">Assistant Financière du Projet YEWA2</p>
        </div>

        <div className="border-t pt-4 pb-4">
          <h4 className="text-lg font-semibold">Type d’évaluation</h4>
          <p className="text-gray-600">{request.type}</p>
        </div>

        {/* Close Button */}
        <div className="text-right mt-6">
          <button
            onClick={closeModal}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
