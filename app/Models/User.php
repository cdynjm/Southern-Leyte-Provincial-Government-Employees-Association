<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'offices_id',
        'name',
        'position',
        'contactNumber',
        'startDate',
        'endDate',
        'employeeID',
        'birthDate',
        'employmentType',
        'email',
        'password',
        'totalContribution',
        'role',
        'specialAccount'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function contributions()
    {
        return $this->hasMany(Contributions::class, 'users_id');
    }

    public function loanamortization()
    {
        return $this->hasMany(LoanAmortization::class, 'users_id');
    }

    public function loaninstallment()
    {
        return $this->hasMany(LoanInstallment::class, 'users_id');
    }

    public function office()
    {
        return $this->belongsTo(Offices::class, 'offices_id');
    }

    public function loantracker()
    {
        return $this->hasOne(LoanTracker::class, 'users_id');
    }

    
    public function canViewLoan(LoanAmortization $borrower): bool
    {
        if ($this->specialAccount != 'No' && (int) $this->loantracker?->tracker === (int) $borrower->tracker) {
            return true;
        }
        else if($this->specialAccount != 'No' && (int) $this->id === (int) $borrower->users_id) {
            return true;
        }
        else {
            return $this->id === $borrower->users_id;
        }
    }

}
