// EngagementList.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import EngagementForm from './EngagementForm';
import BudgetTrackingForm from './BudgetTrackingForm';
import AccountingImputationForm from './AccountingImputationForm';
import EngagementDetails from './EngagementDetails';

const EngagementList = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [selectedProject, setSelectedProject] = useState(null);
    const [engagements, setEngagements] = useState([]);
    const [projects, setProjects] = useState([]);
    const [filteredEngagements, setFilteredEngagements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedEngagement, setSelectedEngagement] = useState(null);

    useEffect(() => {
        fetchProjects();
        fetchEngagements();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [engagements, selectedProject, startDate, endDate]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/api/projects');
            const options = response.data.map((project) => ({
                value: project.id,
                label: project.title,
            }));
            setProjects([{ value: '', label: 'Tous les projets' }, ...options]);
        } catch (err) {
            console.error('Erreur lors de la récupération des projets:', err);
        }
    };

    const fetchEngagements = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/engagements');
            setEngagements(response.data);
            setLoading(false);
        } catch (err) {
            setError('Erreur lors de la récupération des engagements');
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = engagements;

        // Filtrer par projet
        if (selectedProject && selectedProject.value) {
            filtered = filtered.filter(
                (engagement) => engagement.project_id === selectedProject.value
            );
        }

        // Filtrer par date
        if (startDate && endDate) {
            filtered = filtered.filter((engagement) => {
                const engagementDate = new Date(engagement.date);
                return (
                    engagementDate >= new Date(startDate) &&
                    engagementDate <= new Date(endDate)
                );
            });
        } else if (startDate) {
            filtered = filtered.filter(
                (engagement) => new Date(engagement.date) >= new Date(startDate)
            );
        } else if (endDate) {
            filtered = filtered.filter(
                (engagement) => new Date(engagement.date) <= new Date(endDate)
            );
        }

        setFilteredEngagements(filtered);
    };

    const handleAddClick = () => {
        if (activeTab === 'description') {
            // Pour créer un nouvel engagement
            setSelectedEngagement(null);
            setShowForm(true);
        } else {
            
            if (!selectedEngagement) {
                alert('Veuillez sélectionner un engagement pour ajouter des données.');
                return;
            }
            setShowForm(true);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        fetchEngagements(); 
    };

    const handleEditClick = (engagement) => {
        setSelectedEngagement(engagement);
        setActiveTab('description'); 
        setShowForm(true);
    };

    const handleDetailsClick = (engagement) => {
        setSelectedEngagement(engagement);
        setActiveTab('description'); 
        setShowDetails(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet engagement ?')) {
            try {
                await axios.delete(`/api/engagements/${id}`);
                fetchEngagements();
            } catch (err) {
                console.error('Erreur lors de la suppression de l’engagement:', err);
            }
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 lg:mb-0 lg:mr-6">
                    FICHE D’ENGAGEMENT ET DE LIQUIDATION DES DEPENSES
                </h2>

                <div className="flex items-center space-x-4">
                    <div className="bg-white border border-gray-300 rounded-lg flex items-center space-x-4 p-2 shadow-sm">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-300 rounded-lg text-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            placeholder="Date de début"
                        />
                        <span>-</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-300 rounded-lg text-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            placeholder="Date de fin"
                        />
                    </div>

                    <button
                        onClick={handleAddClick}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center shadow-md"
                    >
                        <span className="mr-2">Ajouter</span>
                        <FaPlus />
                    </button>
                </div>
            </div>

            {/* Formulaire de filtre par projet avec react-select */}
            <div className="mb-4">
                <label htmlFor="project-filter" className="text-gray-700 mr-2">
                    Filtrer par projet:
                </label>
                <Select
                    id="project-filter"
                    value={selectedProject}
                    onChange={(selectedOption) => setSelectedProject(selectedOption)}
                    options={projects}
                    className="w-full lg:w-1/3"
                    placeholder="Sélectionner un projet"
                    isClearable
                />
            </div>

            {showDetails ? (
                <EngagementDetails
                    engagement={selectedEngagement}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    onClose={() => setShowDetails(false)}
                />
            ) : (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead>
                        <tr>
                            <th className="py-3 px-4 bg-gray-100 text-left font-medium text-gray-600 border border-gray-300">
                                Projet
                            </th>
                            <th className="py-3 px-4 bg-gray-100 text-left font-medium text-gray-600 border border-gray-300">
                                Service demandeur
                            </th>
                            <th className="py-3 px-4 bg-gray-100 text-left font-medium text-gray-600 border border-gray-300">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEngagements.map((engagement) => (
                            <tr key={engagement.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 border border-gray-300">
                                    {engagement.project ? engagement.project.title : 'N/A'}
                                </td>
                                <td className="py-3 px-4 border border-gray-300">
                                    {engagement.service_demandeur}
                                </td>
                                <td className="py-3 px-4 border border-gray-300 flex space-x-4">
                                    <button
                                        onClick={() => handleDetailsClick(engagement)}
                                        className="text-gray-600 hover:text-black focus:outline-none"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(engagement)}
                                        className="text-gray-600 hover:text-black focus:outline-none"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(engagement.id)}
                                        className="text-red-600 hover:text-red-800 focus:outline-none"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Affichage des formulaires en fonction de l'onglet actif */}
            {showForm && activeTab === 'description' && (
                <EngagementForm
                    onClose={handleCloseForm}
                    engagement={selectedEngagement}
                    projects={projects}
                />
            )}
            {showForm && activeTab === 'suivie' && (
                <BudgetTrackingForm
                    onClose={handleCloseForm}
                    engagementId={selectedEngagement?.id}
                />
            )}
            {showForm && activeTab === 'imputation' && (
                <AccountingImputationForm
                    onClose={handleCloseForm}
                    engagementId={selectedEngagement?.id}
                />
            )}
        </div>
    );
};

export default EngagementList;
