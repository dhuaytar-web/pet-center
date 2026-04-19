import { Suspense } from 'react'
import LoginForm from '@/app/admin/login/LoginForm'

export default function AdminLoginPage() {
  return (
    <div className="container-pet py-12">
      <div className="mx-auto max-w-md">
        <Suspense fallback={<p className="text-sm text-slate-600">Cargando acceso...</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
