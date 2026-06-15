import { Head, usePage } from '@inertiajs/react';

export default function Index() {
    const { products } = usePage().props;

    return (
        <>
            <Head title="WooCommerce Producten" />
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">WooCommerce Producten</h1>
                <ul className="space-y-4">
                    {products.map((product) => (
                        <li key={product.id} className="p-4 border rounded-xl">
                            <h2 className="text-xl font-semibold">{product.name}</h2>
                            <p className="text-gray-600">Prijs: €{product.regular_price}</p>
                            {product.images?.[0] && (
                                <img
                                    src={product.images[0].src}
                                    alt={product.name}
                                    className="w-32 mt-2"
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
