'use client';

import { useUsersHook } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { toast } from "sonner";
import { User, Phone, Shield, UserMinus, UserCheck, Trash2 } from 'lucide-react';
import { User as UserType } from '@/types/user';
import { cn } from '@/lib/utils';
import { useAuth } from "@/hooks/useAuth";
import { EditUserModal } from '@/components/common/EditUserModal';
import { CreateUserModal } from '@/components/common/CreateUserModal';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

export default function AdminUsersPage() {
    const { user: currentUser, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const { users, isLoading, updateUser, isUpdating, deleteUser, isDeleting } = useUsersHook();
    const [userToDelete, setUserToDelete] = useState<UserType | null>(null);

    useEffect(() => {
        if (!authLoading && (!currentUser || currentUser.funcao !== 'admin')) {
            toast.error("Acesso restrito a administradores.");
            router.back();
        }
    }, [currentUser, authLoading, router]);

    const handleToggleStatus = async (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
        try {
            await updateUser({ id, data: { situacao: newStatus } });
            toast.success(`Usuário ${newStatus === 'ativo' ? 'ativado' : 'desativado'}`);
        } catch {
            toast.error("Erro ao alterar situação");
        }
    };

    const handleToggleRole = async (id: number, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            await updateUser({ id, data: { funcao: newRole } });
            toast.success(`Nível de acesso alterado para ${newRole}`);
        } catch {
            toast.error("Erro ao alterar permissão");
        }
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser(userToDelete.id);
            toast.success(`Usuário ${userToDelete.username} removido.`);
        } catch {
            toast.error("Erro ao excluir usuário.");
        } finally {
            setUserToDelete(null);
        }
    };

    if (isLoading || authLoading) {
        return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
    }

    if (currentUser?.funcao !== 'admin') return null;

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-0 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter italic">
                        Gestão de <span className="text-cyan-500">Membros</span>
                    </h1>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">
                        Controle de acessos e setores da PASCOM
                    </p>
                </div>
                <CreateUserModal />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {users.map((member) => (
                    <div
                        key={member.id}
                        className={cn(
                            "group relative bg-white/[0.02] border rounded-[2rem] p-4 sm:p-6 lg:p-8 transition-all duration-500 hover:shadow-2xl",
                            member.situacao === 'ativo'
                                ? "border-white/10 hover:border-cyan-500/30"
                                : "border-rose-500/20 opacity-60"
                        )}
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 flex items-center justify-center">
                                    <User
                                        className={cn(
                                            "w-7 h-7 sm:w-8 sm:h-8",
                                            member.situacao === 'ativo'
                                                ? "text-cyan-400"
                                                : "text-gray-600"
                                        )}
                                    />
                                </div>
                                <div className="sm:hidden">
                                    <h3 className="text-base font-black text-white leading-tight">
                                        {member.username}
                                    </h3>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-cyan-500/80">
                                        {member.setor || 'Sem Setor'}
                                    </p>
                                </div>
                            </div>

                            <div className="hidden sm:flex gap-2 self-end sm:self-auto">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={member.id === currentUser?.id || isUpdating}
                                    onClick={() => handleToggleRole(member.id, member.funcao)}
                                    className={cn(
                                        "rounded-xl transition-all w-10 h-10",
                                        member.funcao === 'admin'
                                            ? "text-amber-400 bg-amber-400/10"
                                            : "text-gray-500",
                                        member.id === currentUser?.id && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    <Shield className="w-5 h-5" />
                                </Button>

                                <EditUserModal member={member} />

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={member.id === currentUser?.id || isDeleting}
                                    onClick={() => setUserToDelete(member)}
                                    className="text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl w-10 h-10"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex sm:hidden items-center justify-between gap-3 mb-6">
                            <div className="flex gap-2">
                                <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold uppercase tracking-tight text-gray-400">
                                    {member.funcao}
                                </span>
                                <span
                                    className={cn(
                                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight border",
                                        member.situacao === 'ativo'
                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                            : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                                    )}
                                >
                                    {member.situacao}
                                </span>
                            </div>

                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={member.id === currentUser?.id || isUpdating}
                                    onClick={() => handleToggleRole(member.id, member.funcao)}
                                    className={cn(
                                        "w-9 h-9 rounded-xl",
                                        member.funcao === 'admin'
                                            ? "text-amber-400 bg-amber-400/10"
                                            : "text-gray-500"
                                    )}
                                >
                                    <Shield className="w-4 h-4" />
                                </Button>

                                <EditUserModal member={member} />

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={member.id === currentUser?.id || isDeleting}
                                    onClick={() => setUserToDelete(member)}
                                    className="w-9 h-9 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="hidden sm:block space-y-1 mb-6">
                            <h3 className="text-xl font-black text-white tracking-tight">
                                {member.username}
                            </h3>
                            <p className="text-xs font-black uppercase tracking-widest text-cyan-500/80">
                                {member.setor || 'Sem Setor'}
                            </p>
                        </div>

                        <div className="hidden sm:flex flex-wrap gap-2 mb-6 sm:mb-8">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                {member.funcao}
                            </span>
                            <span
                                className={cn(
                                    "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter border",
                                    member.situacao === 'ativo'
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                        : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                                )}
                            >
                                {member.situacao}
                            </span>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3 text-sm text-gray-400 font-medium break-all">
                                <Phone className="w-4 h-4 text-cyan-600 shrink-0" />
                                {member.phone || 'N/A'}
                            </div>
                        </div>

                        {member.id !== currentUser?.id ? (
                            <Button
                                disabled={isUpdating}
                                onClick={() => handleToggleStatus(member.id, member.situacao)}
                                className={cn(
                                    "w-full mt-6 h-12 rounded-2xl font-bold text-sm sm:text-base",
                                    member.situacao === 'ativo'
                                        ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"
                                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                                )}
                            >
                                {member.situacao === 'ativo' ? (
                                    <>
                                        <UserMinus className="w-4 h-4 mr-2" />
                                        Desativar Membro
                                    </>
                                ) : (
                                    <>
                                        <UserCheck className="w-4 h-4 mr-2" />
                                        Ativar Membro
                                    </>
                                )}
                            </Button>
                        ) : (
                            <div className="w-full mt-6 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                                Você (Perfil Atual)
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
                <AlertDialogContent className="bg-gray-900 border-white/10 text-white rounded-[2rem] max-w-[90vw] sm:max-w-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl sm:text-2xl font-black italic">
                            EXCLUIR PERMANENTEMENTE?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400 text-sm sm:text-base">
                            Você está prestes a remover <strong>{userToDelete?.username}</strong>.
                            Esta ação apagará o histórico de escalas e acessos deste usuário e não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-3">
                        <AlertDialogCancel className="bg-white/5 border-white/10 text-white rounded-xl">
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl"
                        >
                            Confirmar Exclusão
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
