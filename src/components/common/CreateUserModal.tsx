'use client';

import { useState } from 'react';
import { useUsersHook } from '@/hooks/useUsers';
import { CreateUserDTO } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { UserPlus, Lock, User as UserIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function CreateUserModal() {
    const [open, setOpen] = useState(false);
    const {
        createUser,
        isCreating,
    } = useUsersHook();

    const [form, setForm] = useState<Required<CreateUserDTO>>({
        username: '',
        password: '',
        phone: '',
        setor: '',
        funcao: 'user'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createUser(form);
            toast.success("Membro cadastrado!");
            setOpen(false);
            setForm({ username: '', password: '', phone: '', setor: '', funcao: 'user' });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erro no cadastro";
            toast.error(message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl gap-2 shadow-lg shadow-cyan-900/20">
                    <UserPlus className="w-5 h-5" /> Novo Membro
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[450px] bg-gray-900 border-white/10 text-white rounded-[2.5rem]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
                        Cadastrar <span className="text-cyan-500">Membro</span>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label className="text-gray-400 ml-1">Nome de Usuário</Label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
                            <Input
                                required
                                value={form.username}
                                onChange={e => setForm({...form, username: e.target.value})}
                                className="bg-white/5 border-white/10 rounded-xl h-12 text-white pl-10 sm:pl-12"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-400 ml-1">Senha Inicial</Label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
                            <Input
                                required
                                type="password"
                                value={form.password}
                                onChange={e => setForm({...form, password: e.target.value})}
                                className="bg-white/5 border-white/10 rounded-xl h-12 text-white pl-10 sm:pl-12"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-gray-400 ml-1">Telefone</Label>
                            <Input
                                value={form.phone ?? ''}
                                onChange={e => setForm({...form, phone: e.target.value})}
                                className="bg-white/5 border-white/10 rounded-xl h-12 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-400 ml-1">Setor</Label>
                            <Input
                                value={form.setor ?? ''}
                                onChange={e => setForm({...form, setor: e.target.value})}
                                className="bg-white/5 border-white/10 rounded-xl h-12 text-white"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isCreating}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-12 sm:h-14 rounded-2xl mt-4"
                    >
                        {isCreating ? 'Processando...' : 'Cadastrar'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}