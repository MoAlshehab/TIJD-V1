<?php

namespace App\Http\Controllers\Woocommerce;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class WoocommerceController extends Controller
{
    public function index()
    {
        return response()->json([
            'message' => 'WooCommerce controller werkt!',
        ]);
    }

    // Toont het formulier (GET /woocommerce/products/create)

    public function create()
    {
        return Inertia::render('Woocommerce/Products/Create');
    }
    // Verwerkt het formulier (POST /woocommerce/products)

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'image' => 'nullable|url',
        ]);

        // Check of keys bestaan
        $key = env('WOOCOMMERCE_KEY');
        $secret = env('WOOCOMMERCE_SECRET');

        if (! $key || ! $secret) {
            return back()->withErrors(['error' => 'WooCommerce API keys zijn niet goed ingesteld.']);
        }

        $response = Http::withBasicAuth($key, $secret)->post('http://localhost:8080/wp-json/wc/v3/products', [
            'name' => $request->name,
            'type' => 'simple',
            'regular_price' => $request->price,
            'description' => $request->description,
            'images' => $request->image ? [['src' => $request->image]] : [],
        ]);

        if ($response->failed()) {
            return back()->withErrors(['error' => 'Product toevoegen mislukt: '.$response->body()]);
        }

        return redirect()->route('products.create', ['success' => 1]);
    }

    public function fetchProducts()
    {
        // Voorbeeld van verbinding met de WooCommerce REST API
        $response = Http::withBasicAuth(
            env('WOOCOMMERCE_KEY'),
            env('WOOCOMMERCE_SECRET')
        )->get('http://localhost:8080/wp-json/wc/v3/products');

        return $response->json();
    }

    public function showProducts()
    {
        $key = env('WOOCOMMERCE_KEY');
        $secret = env('WOOCOMMERCE_SECRET');

        if (! $key || ! $secret) {
            abort(500, 'WooCommerce API keys ontbreken');
        }

        $response = Http::withBasicAuth($key, $secret)
            ->get('http://localhost:8080/wp-json/wc/v3/products');

        if ($response->failed()) {
            abort(500, 'Kan producten niet ophalen: '.$response->body());
        }

        $products = $response->json();

        return Inertia::render('Woocommerce/Products/Index', [
            'products' => $products,
        ]);
    }
}
