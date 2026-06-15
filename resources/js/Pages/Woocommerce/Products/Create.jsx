import { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Create() {
    const { props } = usePage();
    const [message, setMessage] = useState('');

    // Inertia useForm hook voor makkelijk formulierbeheer
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        description: '',
        image: '',
    });

    // Check url voor success query param, toon bericht
    useEffect(() => {
        if (window.location.search.includes('success=1')) {
            setMessage('✅ Product succesvol toegevoegd!');
            reset();
            // Optioneel: remove query param zonder herladen
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        setMessage('');
        post('/woocommerce/products/store');
    }

    return (
        <>
            <Head title="Nieuw product toevoegen" />
            <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md space-y-6">
                <h1 className="text-2xl font-bold text-primary">Nieuw product toevoegen</h1>

                {message && (
                    <div className="p-3 bg-green-100 text-green-800 rounded">{message}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Naam</label>
                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`w-full border p-2 rounded-xl focus:outline-none focus:ring focus:ring-primary ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        />
                        {errors.name && (
                            <div className="text-red-600 text-sm mt-1">{errors.name}</div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Prijs</label>
                        <input
                            type="number"
                            step="0.01"
                            name="price"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            className={`w-full border p-2 rounded-xl focus:outline-none focus:ring focus:ring-primary ${
                                errors.price ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        />
                        {errors.price && (
                            <div className="text-red-600 text-sm mt-1">{errors.price}</div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Omschrijving</label>
                        <textarea
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className={`w-full border p-2 rounded-xl focus:outline-none focus:ring focus:ring-primary ${
                                errors.description ? 'border-red-500' : 'border-gray-300'
                            }`}
                            rows={4}
                        />
                        {errors.description && (
                            <div className="text-red-600 text-sm mt-1">{errors.description}</div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Afbeelding URL</label>
                        <input
                            type="url"
                            name="image"
                            value={data.image}
                            onChange={(e) => setData('image', e.target.value)}
                            className={`w-full border p-2 rounded-xl focus:outline-none focus:ring focus:ring-primary ${
                                errors.image ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.image && (
                            <div className="text-red-600 text-sm mt-1">{errors.image}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-opacity-90 transition disabled:opacity-50"
                    >
                        {processing ? 'Toevoegen...' : 'Toevoegen'}
                    </button>
                </form>
            </div>
        </>
    );
}
