import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Custom styled SweetAlert2 instance matching the "Animesh ki Baatein" Soft UI design system
export const CustomSwal = Swal.mixin({
  customClass: {
    popup: "rounded-2xl shadow-2xl border border-[#E9E7F1] p-6 font-sans text-left",
    title: "font-heading font-bold text-xl text-[#202A3D] mb-2",
    htmlContainer: "text-sm text-[#667085] leading-relaxed",
    confirmButton:
      "px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2",
    cancelButton:
      "px-5 py-2.5 rounded-xl text-sm font-semibold text-[#202A3D] bg-[#FAF9FE] border border-[#E9E7F1] hover:bg-[#F3F1FA] transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2",
    actions: "gap-3 mt-6 flex-row-reverse justify-start",
  },
  buttonsStyling: false,
});

export interface ConfirmDialogOptions {
  title: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isDestructive?: boolean;
  icon?: "warning" | "error" | "question" | "info" | "success";
}

/**
 * Standard confirmation prompt for the Admin Panel using SweetAlert2
 * @returns Promise<boolean> - true if confirmed, false if cancelled
 */
export async function confirmAction({
  title,
  text = "Are you sure? This action cannot be undone.",
  confirmButtonText = "Yes, proceed",
  cancelButtonText = "Cancel",
  isDestructive = true,
  icon = "warning",
}: ConfirmDialogOptions): Promise<boolean> {
  const result = await CustomSwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: false,
    focusCancel: isDestructive,
    iconColor: isDestructive ? "#DC2626" : "#7434E8",
    customClass: {
      popup: "rounded-2xl shadow-2xl border border-[#E9E7F1] p-6 font-sans text-center",
      title: "font-heading font-bold text-xl text-[#202A3D] mt-2 mb-1",
      htmlContainer: "text-sm text-[#667085] leading-relaxed my-2",
      confirmButton: `px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isDestructive
          ? "bg-[#DC2626] hover:bg-[#B91C1C] focus:ring-[#DC2626]/30 shadow-[#DC2626]/20"
          : "bg-[#7434E8] hover:bg-[#6028C9] focus:ring-[#7434E8]/30 shadow-[#7434E8]/20"
      }`,
      cancelButton:
        "px-5 py-2.5 rounded-xl text-sm font-semibold text-[#202A3D] bg-white border border-[#E9E7F1] hover:bg-[#FAF9FE] hover:border-[#D7D4E5] transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7434E8]/20",
      actions: "gap-3 mt-6 flex justify-center",
    },
  });

  return result.isConfirmed;
}

/**
 * Show a success notification alert
 */
export async function showSuccessAlert(title: string, text?: string): Promise<void> {
  await CustomSwal.fire({
    icon: "success",
    title,
    text,
    timer: 2500,
    showConfirmButton: false,
    iconColor: "#16A34A",
  });
}

/**
 * Show an error notification alert
 */
export async function showErrorAlert(title: string, text?: string): Promise<void> {
  await CustomSwal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "Got it",
    iconColor: "#DC2626",
  });
}
