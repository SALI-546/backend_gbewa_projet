import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BudgetTrackingDetails from './BudgetTrackingDetails';
import AccountingImputationDetails from './AccountingImputationDetails';
import OperationDescriptionModal from './OperationDescriptionModal';
import BudgetTrackingForm from './BudgetTrackingForm';
import AccountingImputationForm from './AccountingImputationForm';
import ApprovalModal from './ApprovalModal';

const EngagementDetails = ({ engagement, onClose, activeTab, onTabChange }) => {
    const [engagementDetails, setEngagementDetails] = useState(null);
    const [isEditingOperations, setIsEditingOperations] = useState(false);
    const [isEditingBudgetTracking, setIsEditingBudgetTracking] = useState(false);
    const [isEditingAccountingImputation, setIsEditingAccountingImputation] = useState(false);
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

    useEffect(() => {
        const fetchEngagementDetails = async () => {
            try {
                const response = await axios.get(`/api/engagements/${engagement.id}`);
                console.log('Engagement Details Response:', response.data); // Pour débogage
                setEngagementDetails(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des détails de l’engagement:', err);
            }
        };

        if (engagement) {
            fetchEngagementDetails();
        }
    }, [engagement]);

    const handleTabClick = (tab) => {
        onTabChange(tab);
    };

    const totalMontant = engagementDetails?.engagement_operations
        ? engagementDetails.engagement_operations.reduce(
              (total, operation) => total + parseFloat(operation.montant),
              0
          ).toFixed(2)
        : '0.00';

    const reloadEngagementDetails = async () => {
        try {
            const response = await axios.get(`/api/engagements/${engagement.id}`);
            setEngagementDetails(response.data);
        } catch (err) {
            console.error('Erreur lors de la mise à jour des détails de l’engagement:', err);
        }
    };

    const handleApprovalSubmit = async ({ avis, signature_type, signature_image, observation }) => {
        try {
            await axios.post(`/api/budget-trackings/${engagementDetails.budget_tracking.id}/approvals`, {
                avis,
                signature_type,
                signature_image,
                observation,
            });
            alert('Approbation enregistrée avec succès.');
            setIsApprovalModalOpen(false);
            reloadEngagementDetails();
        } catch (err) {
            console.error('Erreur lors de l\'enregistrement de l\'approbation:', err);
            alert('Erreur lors de l\'enregistrement de l\'approbation : ' + (err.response?.data?.message || err.message));
        }
    };

    if (!engagementDetails) {
        return <div>Chargement des détails...</div>;
    }

    console.log('Engagement ID passed to BudgetTrackingDetails:', engagement.id); // Pour débogage

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between mb-6">
                <div>
                    <p><span className="font-semibold">Date:</span> {engagementDetails.date || 'N/A'}</p>
                    <p><span className="font-semibold">WBS:</span> {engagementDetails.wbs || 'N/A'}</p>
                    <p><span className="font-semibold">Référence:</span> {engagementDetails.reference || 'N/A'}</p>
                </div>
                <div>
                    <p><span className="font-semibold">Service demandeur:</span> {engagementDetails.service_demandeur || 'N/A'}</p>
                    <p><span className="font-semibold">Motif de la demande:</span> {engagementDetails.motif_demande || 'N/A'}</p>
                </div>
            </div>

            <div className="flex mb-4">
                <button
                    className={`px-4 py-2 rounded-t-lg ${activeTab === 'description' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => handleTabClick('description')}
                >
                    Description de l'Opération
                </button>
                <button
                    className={`px-4 py-2 rounded-t-lg ${activeTab === 'suivie' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => handleTabClick('suivie')}
                >
                    Suivi Budgétaire
                </button>
                <button
                    className={`px-4 py-2 rounded-t-lg ${activeTab === 'imputation' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => handleTabClick('imputation')}
                >
                    Imputation Comptable
                </button>
            </div>

            <div className="p-4 border border-t-0 rounded-b-lg bg-gray-50">
                {activeTab === 'description' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Description de l'Opération</h3>
                            <button
                                onClick={() => setIsEditingOperations(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg"
                            >
                                Modifier
                            </button>
                        </div>
                        <div className="relative">
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                                <thead>
                                    <tr>
                                        <th colSpan="8" className="py-2 px-4 bg-gray-200 text-center text-lg font-bold border-b border-gray-300">
                                            Description de l'Opération
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className="py-2 px-4 border border-gray-300">N°</th>
                                        <th className="py-2 px-4 border border-gray-300">Désignation</th>
                                        <th className="py-2 px-4 border border-gray-300">Quantité</th>
                                        <th className="py-2 px-4 border border-gray-300">Nombre</th>
                                        <th className="py-2 px-4 border border-gray-300">PU</th>
                                        <th className="py-2 px-4 border border-gray-300">Montant</th>
                                        <th className="py-2 px-4 border border-gray-300">Observations</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {engagementDetails.engagement_operations &&
                                        engagementDetails.engagement_operations.map((operation, index) => (
                                            <tr key={operation.id}>
                                                <td className="py-2 px-4 border border-gray-300">{index + 1}</td>
                                                <td className="py-2 px-4 border border-gray-300">{operation.designation}</td>
                                                <td className="py-2 px-4 border border-gray-300">{operation.quantite}</td>
                                                <td className="py-2 px-4 border border-gray-300">{operation.nombre}</td>
                                                <td className="py-2 px-4 border border-gray-300">{operation.pu}</td>
                                                <td className="py-2 px-4 border border-gray-300">{operation.montant}</td>
                                                <td className="py-2 px-4 border border-gray-300">{operation.observations}</td>
                                            </tr>
                                        ))}
                                    <tr>
                                        <td className="py-2 px-4 border border-gray-300 font-bold" colSpan="5">Total</td>
                                        <td className="py-2 px-4 border border-gray-300 font-bold">{totalMontant}</td>
                                        <td className="py-2 px-4 border border-gray-300"></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="flex justify-end mt-4">
                                <div className="text-right">
                                    <p>Émetteur: (signature et date)</p>
                                    <p style={{ marginBottom: '20px' }}>Le chargé de logistique:</p>
                                    <p>SINSIN Daniel</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'suivie' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Suivi Budgétaire</h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setIsEditingBudgetTracking(true)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => setIsApprovalModalOpen(true)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded-lg"
                                >
                                    Ajouter Approbation
                                </button>
                            </div>
                        </div>
                        <BudgetTrackingDetails engagementId={engagement.id} />

                        {/* Afficher les Approbations */}
                        {engagementDetails.budget_tracking && engagementDetails.budget_tracking.approvals && (
                            <div className="mt-6">
                                <h4 className="text-lg font-bold mb-2">Approbations</h4>
                                {engagementDetails.budget_tracking.approvals.length > 0 ? (
                                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                                        <thead>
                                            <tr>
                                                <th className="py-2 px-4 border border-gray-300">Avis</th>
                                                <th className="py-2 px-4 border border-gray-300">Type de Signature</th>
                                                <th className="py-2 px-4 border border-gray-300">Signature</th>
                                                <th className="py-2 px-4 border border-gray-300">Observation</th>
                                                <th className="py-2 px-4 border border-gray-300">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {engagementDetails.budget_tracking.approvals.map((approval) => (
                                                <tr key={approval.id}>
                                                    <td className="py-2 px-4 border border-gray-300">{approval.avis}</td>
                                                    <td className="py-2 px-4 border border-gray-300">{approval.signature_type}</td>
                                                    <td className="py-2 px-4 border border-gray-300">
                                                        <img src={approval.signature_image} alt="Signature" className="w-32 h-auto border rounded-lg" />
                                                    </td>
                                                    <td className="py-2 px-4 border border-gray-300">{approval.observation || 'N/A'}</td>
                                                    <td className="py-2 px-4 border border-gray-300">{new Date(approval.approved_at).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>Aucune approbation enregistrée.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'imputation' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Imputation Comptable</h3>
                            <button
                                onClick={() => setIsEditingAccountingImputation(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg"
                            >
                                Modifier
                            </button>
                        </div>
                        <AccountingImputationDetails engagementId={engagement.id} />
                    </div>
                )}
            </div>

            <button
                onClick={onClose}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
            >
                Fermer
            </button>

            {isEditingOperations && (
                <OperationDescriptionModal
                    engagementId={engagement.id}
                    onClose={() => {
                        setIsEditingOperations(false);
                        reloadEngagementDetails();
                    }}
                />
            )}
            {isEditingBudgetTracking && (
                <BudgetTrackingForm
                    engagementId={engagement.id}
                    existingData={engagementDetails.budget_tracking} // Important: on passe les données existantes
                    onClose={() => {
                        setIsEditingBudgetTracking(false);
                        reloadEngagementDetails();
                    }}
                />
            )}
            {isEditingAccountingImputation && (
                <AccountingImputationForm
                    engagementId={engagement.id}
                    existingData={engagementDetails.accounting_imputation} // Important: on passe les données existantes
                    onClose={() => {
                        setIsEditingAccountingImputation(false);
                        reloadEngagementDetails();
                    }}
                />
            )}
            {isApprovalModalOpen && (
                <ApprovalModal
                    onClose={() => setIsApprovalModalOpen(false)}
                    onSubmit={handleApprovalSubmit}
                />
            )}
        </div>
    );

};

export default EngagementDetails;
