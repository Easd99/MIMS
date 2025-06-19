"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Iniciando seed...');
    const existing = await prisma.product.count();
    console.log(`🧾 Productos existentes: ${existing}`);
    if (existing === 0) {
        await prisma.product.createMany({
            data: [
                {
                    name: 'Camiseta Roja',
                    description: 'Talla M',
                    price: 50000,
                    stock: 10,
                },
                {
                    name: 'Camiseta Verde',
                    description: 'Talla S',
                    price: 30000,
                    stock: 15,
                },
            ],
            skipDuplicates: true,
        });
        console.log('✅ Productos insertados');
    }
    else {
        console.log('ℹ️  Seed omitido, productos ya existen');
    }
}
main()
    .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map