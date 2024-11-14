// EmployeeDetails.jsx

import React from 'react';

const EmployeeDetails = ({ employee, closeModal }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white shadow-lg rounded-lg w-1/2 max-h-[80vh] overflow-y-auto p-6 no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Pour Firefox et IE
      >
        {/* Title Section */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Fiche de poste</h2>
          <h3 className="text-xl text-green-600 font-semibold">Comptable</h3>
          <div className="border-t border-b py-4 mb-4 text-sm text-gray-600">
            <span className="block">POSTE OCCUPÉ PAR</span>
            <input
              type="text"
              placeholder="Nom & Prénom"
              
            />
          </div>
        </div>

        {/* Affectation Section */}
        <div className="border-t border-b py-4 mb-4">
          <h4 className="text-lg font-semibold">Affectation</h4>
          <div className="flex justify-between">
            <p>Service :</p>
            <p className="font-semibold">Nom du Service</p>
          </div>
          <div className="flex justify-between">
            <p>Durée Hebdomadaire De Travail :</p>
            <p className="font-semibold">08H00</p>
          </div>
        </div>

        {/* Informations Section */}
        <div className="border-t border-b py-4 mb-4">
          <h4 className="text-lg font-semibold">Informations</h4>
          <div className="flex justify-between">
            <p>Nature Du Poste :</p>
            <p className="font-semibold">CDI</p>
          </div>
          <div className="flex justify-between">
            <p>Statut Du Poste :</p>
            <p className="font-semibold">IAC (Ingénieurs Assimilés Et Cadres)</p>
          </div>
          <div className="flex justify-between">
            <p>Temps De Travail :</p>
            <p className="font-semibold">Temps Plein</p>
          </div>
          <div className="flex justify-between">
            <p>Localisation du Poste :</p>
            <p className="font-semibold">Temps Plein</p>
          </div>
          <div className="flex justify-between">
            <p>Supérieur Hiérarchique Direct :</p>
            <p className="font-semibold">Nom du Supérieur</p>
          </div>
        </div>

        {/* Rémunération Section */}
        <div className="border-t border-b py-4 mb-4">
          <h4 className="text-lg font-semibold">Rémunération Du Poste</h4>
          <div className="flex justify-between">
            <p>Annuel Brut :</p>
            <p className="font-semibold">A Compléter</p>
          </div>
          <div className="flex justify-between">
            <p>Variable :</p>
            <p className="font-semibold">Oui</p>
          </div>
        </div>

        {/* Autonomie et Responsabilités Section */}
        <div className="border-t border-b py-4 mb-4">
          <h4 className="text-lg font-semibold">Autonomie et Responsabilités</h4>
          <p className="text-gray-700">A Compléter</p>
        </div>

        {/* Liaisons Fonctionnelles Section */}
        <div className="border-t border-b py-4 mb-4">
          <h4 className="text-lg font-semibold">Liaisons Fonctionnelles</h4>
          <div className="flex justify-between">
            <p>Interne À l'Organisation :</p>
            <p className="font-semibold">Oui</p>
          </div>
          <div className="flex justify-between">
            <p>Externe À l'Organisation :</p>
            <p className="font-semibold">Oui</p>
          </div>
        </div>

        {/* Moyens Techniques Section */}
        <div className="border-t border-b py-4 mb-4">
          <h4 className="text-lg font-semibold">Moyens Techniques Mis à Disposition</h4>
          <p className="text-gray-700">A Compléter</p>
        </div>

        {/* Missions et Activités du Poste Section */}
        <div className="border-t border-b py-4 mb-4">
          <h4 className="text-lg font-semibold">Missions et Activités du Poste</h4>
          <div className="flex justify-between">
            <p>Missions Principales :</p>
            <p className="font-semibold">A Compléter</p>
          </div>
          <div className="flex justify-between">
            <p>Missions Spécifiques :</p>
            <p className="font-semibold">A Compléter</p>
          </div>
          <div className="flex justify-between">
            <p>Intérêts, Contraintes, Difficultés du Poste :</p>
            <p className="font-semibold">A Compléter</p>
          </div>
        </div>

        {/* Compétences Requises Section */}
        <div className="border-t border-b py-4 mb-4">
          <h4 className="text-lg font-semibold">Compétences Requises</h4>
          <div className="flex justify-between">
            <p>Savoirs :</p>
            <p className="font-semibold">A Compléter</p>
          </div>
          <div className="flex justify-between">
            <p>Savoirs Faire :</p>
            <p className="font-semibold">A Compléter</p>
          </div>
          <div className="flex justify-between">
            <p>Savoirs Être :</p>
            <p className="font-semibold">A Compléter</p>
          </div>
          <div className="flex justify-between">
            <p>Diplômes :</p>
            <p className="font-semibold">A Compléter</p>
          </div>
        </div>

        {/* Bouton Fermer */}
        <div className="text-right mt-6">
          <button onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
