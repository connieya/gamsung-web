"use client";

import {
  MAIN_PAYMENT_OPTIONS,
  SUB_PAYMENT_OPTIONS,
  type MainPaymentOption,
  type SubPaymentOption,
} from "@/features/payment/constants";

interface PaymentMethodSelectorProps {
  selectedPayment: MainPaymentOption;
  selectedSubPayment: SubPaymentOption;
  onPaymentChange: (value: MainPaymentOption) => void;
  onSubPaymentChange: (value: SubPaymentOption) => void;
}

export function PaymentMethodSelector({
  selectedPayment,
  selectedSubPayment,
  onPaymentChange,
  onSubPaymentChange,
}: PaymentMethodSelectorProps) {
  return (
    <section className="rounded-xl border border-brand-border bg-brand-white p-6">
      <h2 className="text-title font-semibold text-brand-black mb-4">
        결제 수단
      </h2>

      <div className="space-y-3">
        {MAIN_PAYMENT_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-3 cursor-pointer rounded-lg border px-4 py-3 transition-colors ${
              selectedPayment === option.value
                ? "border-brand-black bg-brand-bg"
                : "border-brand-border hover:border-brand-gray"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={option.value}
              checked={selectedPayment === option.value}
              onChange={() => onPaymentChange(option.value)}
              className="h-4 w-4 accent-brand-black"
            />
            <span className="text-body font-medium text-brand-black">
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {selectedPayment === "OTHER" && (
        <div className="mt-3 ml-7 grid grid-cols-2 gap-2 rounded-lg border border-brand-border bg-brand-bg p-4">
          {SUB_PAYMENT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-2 cursor-pointer rounded-md border px-3 py-2 transition-colors ${
                selectedSubPayment === option.value
                  ? "border-brand-black bg-brand-white"
                  : "border-transparent hover:border-brand-gray"
              }`}
            >
              <input
                type="radio"
                name="subPaymentMethod"
                value={option.value}
                checked={selectedSubPayment === option.value}
                onChange={() => onSubPaymentChange(option.value)}
                className="h-3.5 w-3.5 accent-brand-black"
              />
              <span className="text-caption font-medium text-brand-black">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </section>
  );
}
