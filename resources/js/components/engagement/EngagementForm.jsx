import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import OperationDescriptionModal from './OperationDescriptionModal';

const EngagementForm = ({ onClose, engagement, projects }) => {
    const [formData, setFormData] = useState({
        project_id: '',
        order_number: '',
        service_demandeur: '',
        wbs: '',
        motif_demande: '',
        date: '',
        reference: '',
    });

    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [currentEngagement, setCurrentEngagement] = useState(engagement || null);

    useEffect(() => {
        if (currentEngagement) {
            // Pré-remplir le formulaire si un engagement est passé en prop
            setFormData({
                project_id: currentEngagement.project_id,
                order_number: currentEngagement.order_number || '',
                service_demandeur: currentEngagement.service_demandeur || '',
                wbs: currentEngagement.wbs || '',
                motif_demande: currentEngagement.motif_demande || '',
                date: currentEngagement.date || '',
                reference: currentEngagement.reference || '',
            });
        }
    }, [currentEngagement]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (selectedOption) => {
        setFormData({ ...formData, project_id: selectedOption ? selectedOption.value : '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (currentEngagement) {
                // Mettre à jour l'engagement
                const response = await axios.put(`/api/engagements/${currentEngagement.id}`, formData);
                setCurrentEngagement(response.data);
            } else {
                // Créer un nouvel engagement
                const response = await axios.post('/api/engagements', formData);
                setCurrentEngagement(response.data);
            }
            alert('Engagement enregistré avec succès.');
            // Vous pouvez fermer le formulaire si vous le souhaitez
            // onClose();
        } catch (err) {
            console.error('Erreur lors de la soumission du formulaire:', err);
            alert('Erreur lors de la soumission du formulaire : ' + (err.response?.data?.message || err.message));
        }
    };

    const projectOptions = projects.map((project) => ({
        value: project.value || project.id,
        label: project.label || project.title,
    }));

    const handleDescriptionClick = () => {
        if (currentEngagement && currentEngagement.id) {
            setShowDescriptionModal(true);
        } else {
            alert('Veuillez enregistrer l\'engagement avant de décrire les opérations.');
        }
    };

    const handleCloseDescriptionModal = () => {
        setShowDescriptionModal(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{currentEngagement ? 'Modifier' : 'Ajouter'} un Engagement</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-black focus:outline-none">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Sélection du projet */}
                    <div className="mb-4">
                        <Select
                            options={projectOptions}
                            value={projectOptions.find((option) => option.value === formData.project_id)}
                            onChange={handleSelectChange}
                            placeholder="Sélectionner un projet"
                            className="w-full focus:outline-none"
                        />
                    </div>

                    {/* Autres champs du formulaire */}
                    <div className="mb-4">
                        <input
                            type="text"
                            name="order_number"
                            value={formData.order_number}
                            onChange={handleChange}
                            placeholder="Numéro d'ordre"
                            className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />

                        <input
                            type="text"
                            name="service_demandeur"
                            value={formData.service_demandeur}
                            onChange={handleChange}
                            placeholder="Service demandeur"
                            className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />

                        <input
                            type="text"
                            name="wbs"
                            value={formData.wbs}
                            onChange={handleChange}
                            placeholder="WBS"
                            className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />

                        <input
                            type="text"
                            name="motif_demande"
                            value={formData.motif_demande}
                            onChange={handleChange}
                            placeholder="Motif de la demande"
                            className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />

                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            placeholder="Date"
                            className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />

                        <input
                            type="text"
                            name="reference"
                            value={formData.reference}
                            onChange={handleChange}
                            placeholder="Référence"
                            className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handleDescriptionClick}
                            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                        >
                            Description de l’opération
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>

                {/* Modale pour la description */}
                {showDescriptionModal && (
                    <OperationDescriptionModal
                        onClose={handleCloseDescriptionModal}
                        engagementId={currentEngagement.id}
                    />
                )}
            </div>
        </div>
    );
};

export default EngagementForm;
