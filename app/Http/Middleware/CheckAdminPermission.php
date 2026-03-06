<?php 
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckAdminPermission
{
    public function handle(Request $request, Closure $next, $page)
    {
        $user = auth()->user();

        $hasPermission = $user->adminpermissions()
            ->whereHas('permission', function ($query) use ($page) {
                $query->where('pages', $page);
            })
            ->exists();

        if (!$hasPermission) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}