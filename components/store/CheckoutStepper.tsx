type CheckoutStepperProps = {
  step: 1 | 2 | 3
}

const labels = ['Datos', 'Entrega', 'Pago'] as const

export default function CheckoutStepper({ step }: CheckoutStepperProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-3">
      {labels.map((label, index) => {
        const position = (index + 1) as 1 | 2 | 3
        const isDone = position < step
        const isActive = position === step

        return (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center">
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                  isDone
                    ? 'bg-(--pet-green) text-white'
                    : isActive
                      ? 'bg-(--pet-green-dark) text-white'
                      : 'bg-gray-300 text-gray-500'
                }`}
              >
                {isDone ? '✓' : position}
              </span>
              <span className={`mt-1 text-[9px] font-bold ${isActive ? 'text-(--pet-green-dark)' : 'text-gray-400'}`}>{label}</span>
            </div>
            {position < 3 && (
              <span className={`h-[1.5px] flex-1 ${position < step ? 'bg-(--pet-green)' : 'bg-gray-300'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
