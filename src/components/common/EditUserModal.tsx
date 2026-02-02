'use client';

import { useState } from 'react';
import { useUserMutations } from '@/mutations/userMutations';
import { User, UserUpdateDTO } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { Edit2, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface EditUserModalProps {
    member: User;
}

export function EditUserModal({ member }: EditUserModalProps) {
    const [open, setOpen] = useState(false);
    const { updateUser, isUpdating } = useUserMutations();

    // Estado inicial direto, sem useEffect
    const [form, setForm] = useState<UserUpdateDTO>({
        username: member.username,
        setor: member.setor ?? '',
        phone: member.phone ?? '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Limpeza do DTO para o PATCH
        const updateData: UserUpdateDTO = { ...form };
        if (!updateData.password) delete updateData.password;

        try {
            await updateUser({ id: member.id, data: updateData });
            toast.success("Dados atualizados com sucesso!");
            setOpen(false);
        } catch {
            toast.error("Erro ao atualizar voluntário.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-cyan-500 hover:bg-cyan-500/10 rounded-xl"
                >
                    <Edit2 className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-white/10 text-white rounded-[2.5rem] sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
                        Editar <span className="text-cyan-500">Voluntário</span>
                    </DialogTitle>
                </DialogHeader>

                {/* A KEY garante que o formulário resete ao trocar de usuário sem o erro do useEffect */}
                <form
                    key={member.id + open.toString()}
                    onSubmit={handleSubmit}
                    className="space-y-4 mt-4"
                >
                    <div className="space-y-2">
                        <Label className="text-gray-400 ml-1">Nome de Usuário</Label>
                        <Input
                            value={form.username ?? ''} // ?? '' resolve TS2322 (null/undefined)
                            onChange={e => setForm({...form, username: e.target.value})}
                            className="bg-white/5 border-white/10 rounded-xl h-12 text-white"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-gray-400 ml-1">Setor</Label>
                            <Input
                                value={form.setor ?? ''}
                                onChange={e => setForm({...form, setor: e.target.value})}
                                className="bg-white/5 border-white/10 rounded-xl h-12 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-400 ml-1">Telefone</Label>
                            <Input
                                value={form.phone ?? ''}
                                onChange={e => setForm({...form, phone: e.target.value})}
                                className="bg-white/5 border-white/10 rounded-xl h-12 text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/10">
                        <Label className="text-rose-400 text-xs font-bold uppercase ml-1">Resetar Senha (Opcional)</Label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                type="password"
                                placeholder="Nova senha se desejar alterar"
                                value={form.password ?? ''}
                                onChange={e => setForm({...form, password: e.target.value})}
                                className="bg-white/5 border-white/10 rounded-xl pl-12 h-12 text-white"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-14 rounded-2xl mt-4"
                    >
                        {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}