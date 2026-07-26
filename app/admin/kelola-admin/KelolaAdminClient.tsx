"use client";

import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import Icon from "../../components/Icon";
import { createAdmin, updatePassword, updateRole, deleteAdmin } from "./actions";

type AdminUser = {
  id: number;
  username: string;
  role: string;
  namaLengkap: string;
  createdAt: string;
};

export default function KelolaAdminClient({
  admins,
  currentUserId,
}: {
  admins: AdminUser[];
  currentUserId: number;
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState<AdminUser | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<AdminUser | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const clearFeedback = () => setTimeout(() => setFeedback(null), 4000);

  // --- Add Admin ---
  async function handleAddAdmin(formData: FormData) {
    startTransition(async () => {
      const result = await createAdmin(formData);
      if (result.error) {
        setFeedback({ type: "error", message: result.error });
      } else {
        setFeedback({ type: "success", message: result.message || "Berhasil!" });
        setShowAddModal(false);
      }
      clearFeedback();
    });
  }

  // --- Update Password ---
  async function handleUpdatePassword(formData: FormData) {
    startTransition(async () => {
      const result = await updatePassword(formData);
      if (result.error) {
        setFeedback({ type: "error", message: result.error });
      } else {
        setFeedback({ type: "success", message: result.message || "Berhasil!" });
        setShowPasswordModal(null);
      }
      clearFeedback();
    });
  }

  // --- Toggle Role ---
  async function handleToggleRole(user: AdminUser) {
    const newRole = user.role === "admin" ? "superadmin" : "admin";
    const fd = new FormData();
    fd.set("userId", user.id.toString());
    fd.set("role", newRole);
    startTransition(async () => {
      const result = await updateRole(fd);
      if (result.error) {
        setFeedback({ type: "error", message: result.error });
      } else {
        setFeedback({ type: "success", message: result.message || "Berhasil!" });
      }
      clearFeedback();
    });
  }

  // --- Delete Admin ---
  async function handleDeleteAdmin() {
    if (!showDeleteModal) return;
    const fd = new FormData();
    fd.set("userId", showDeleteModal.id.toString());
    startTransition(async () => {
      const result = await deleteAdmin(fd);
      if (result.error) {
        setFeedback({ type: "error", message: result.error });
      } else {
        setFeedback({ type: "success", message: result.message || "Berhasil!" });
      }
      setShowDeleteModal(null);
      clearFeedback();
    });
  }

  return (
    <>
      {/* Feedback Toast */}
      {feedback && (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border animate-slideUpAndFade max-w-sm ${
          feedback.type === "success"
            ? "bg-white border-primary/20 text-primary"
            : "bg-white border-error/20 text-error"
        }`}>
          <Icon
            name={feedback.type === "success" ? "check_circle" : "error"}
            className="text-xl shrink-0"
          />
          <span className="text-sm font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-col md:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-2xl md:text-3xl font-serif font-bold text-on-surface">
            Kelola Admin
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Kelola akun pengguna yang memiliki akses ke dashboard admin.
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="min-h-[44px] py-2 px-4 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
        >
          <Icon name="person_add" className="text-lg" />
          Tambah Admin
        </button>
      </div>

      {/* Admin Table */}
      <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-lowest/50">
                <th className="text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 px-6 py-4">User</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 px-6 py-4">Role</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 px-6 py-4 hidden sm:table-cell">Dibuat</th>
                <th className="text-right text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => {
                const isSelf = admin.id === currentUserId;
                const createdDate = new Date(admin.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                return (
                  <tr
                    key={admin.id}
                    className="border-b border-outline-variant/10 last:border-b-0 hover:bg-surface-container-lowest/30 transition-colors"
                  >
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          admin.role === "superadmin"
                            ? "bg-tertiary/10 text-tertiary"
                            : "bg-primary/10 text-primary"
                        }`}>
                          <span className="font-bold text-sm uppercase">
                            {(admin.namaLengkap?.[0] || admin.username[0])}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">
                            {admin.namaLengkap || admin.username}
                            {isSelf && (
                              <span className="ml-2 text-[10px] text-on-surface-variant/50 font-medium">(Anda)</span>
                            )}
                          </p>
                          <p className="text-xs text-on-surface-variant/60">@{admin.username}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => !isSelf && handleToggleRole(admin)}
                        disabled={isSelf || isPending}
                        title={isSelf ? "Tidak bisa ubah role sendiri" : `Klik untuk ubah ke ${admin.role === "admin" ? "superadmin" : "admin"}`}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                          admin.role === "superadmin"
                            ? "bg-tertiary/10 text-tertiary border border-tertiary/20"
                            : "bg-primary/10 text-primary border border-primary/20"
                        } ${isSelf ? "cursor-default opacity-70" : "cursor-pointer hover:shadow-md hover:scale-105 active:scale-100"}`}
                      >
                        <Icon name={admin.role === "superadmin" ? "shield" : "person"} className="text-xs" />
                        {admin.role === "superadmin" ? "Superadmin" : "Admin"}
                      </button>
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-xs text-on-surface-variant/70">{createdDate}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setShowPasswordModal(admin)} className="min-h-[44px] py-2 px-4 w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant/60 hover:text-tertiary hover:bg-tertiary/10 transition-colors"
                          title="Ubah Password"
                        >
                          <Icon name="key" className="text-lg" />
                        </button>
                        {!isSelf && (
                          <button onClick={() => setShowDeleteModal(admin)} className="min-h-[44px] py-2 px-4 w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant/60 hover:text-error hover:bg-error/10 transition-colors"
                            title="Hapus Admin"
                          >
                            <Icon name="delete" className="text-lg" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {admins.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant/50">
                    <Icon name="group_off" className="text-2xl md:text-4xl mb-2 block mx-auto" />
                    <p className="text-sm font-medium">Belum ada admin terdaftar.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== MODALS ===== */}

      {/* Add Admin Modal */}
      {showAddModal && typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-outline-variant/20 animate-slideUpAndFade overflow-hidden">
              <div className="px-6 py-5 border-b border-outline-variant/15 bg-surface-container-lowest/50">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <Icon name="person_add" className="text-primary text-xl" />
                  Tambah Admin Baru
                </h3>
              </div>
              <form action={handleAddAdmin} className="p-4 md:p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/70 mb-1.5">
                    Username <span className="text-error">*</span>
                  </label>
                  <input
                    name="username"
                    required
                    minLength={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm bg-white"
                    placeholder="contoh: admin_desa"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/70 mb-1.5">
                    Password <span className="text-error">*</span>
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm bg-white"
                    placeholder="Minimal 6 karakter"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/70 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    name="namaLengkap"
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm bg-white"
                    placeholder="Nama yang ditampilkan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/70 mb-1.5">
                    Role
                  </label>
                  <select
                    name="role"
                    defaultValue="admin"
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm bg-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-on-surface-variant/10 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 disabled:opacity-60"
                  >
                    {isPending ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Change Password Modal */}
      {showPasswordModal && typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-outline-variant/20 animate-slideUpAndFade overflow-hidden">
              <div className="px-6 py-5 border-b border-outline-variant/15 bg-surface-container-lowest/50">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <Icon name="key" className="text-tertiary text-xl" />
                  Ubah Password
                </h3>
                <p className="text-xs text-on-surface-variant/60 mt-1">
                  Untuk: <span className="font-semibold text-on-surface">@{showPasswordModal.username}</span>
                </p>
              </div>
              <form action={handleUpdatePassword} className="p-4 md:p-6 space-y-4">
                <input type="hidden" name="userId" value={showPasswordModal.id} />
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/70 mb-1.5">
                    Password Baru <span className="text-error">*</span>
                  </label>
                  <input
                    name="newPassword"
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm bg-white"
                    placeholder="Minimal 6 karakter"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(null)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-on-surface-variant/10 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-tertiary text-on-tertiary hover:bg-tertiary/90 transition-colors shadow-sm shadow-tertiary/20 disabled:opacity-60"
                  >
                    {isPending ? "Menyimpan..." : "Ubah Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl p-4 md:p-6 w-full max-w-sm shadow-2xl border border-outline-variant/20 animate-slideUpAndFade">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                  <Icon name="person_remove" className="text-error text-2xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Hapus Admin</h3>
                  <p className="text-xs text-on-surface-variant/60">Tindakan ini tidak bisa dibatalkan</p>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant/80 mb-6">
                Yakin ingin menghapus admin <span className="font-bold text-on-surface">@{showDeleteModal.username}</span>?
                Akun ini akan dihapus secara permanen.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowDeleteModal(null)} className="min-h-[44px] py-2 px-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-on-surface-variant/10 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteAdmin}
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-error text-white hover:bg-error/90 transition-colors shadow-sm shadow-error/20 disabled:opacity-60"
                >
                  {isPending ? "Menghapus..." : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
