-- Script para insertar usuarios de prueba en la base de datos
-- Ejecutar este script en PostgreSQL para tener datos de prueba

-- Insertar usuarios de prueba
INSERT INTO "Users" ("Nombre", "Email", "PasswordHash", "AvatarUrl", "Rol", "Activo", "FechaCreacion") VALUES
('Fabio Torres', 'fitorres1607@gmail.com', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://robohash.org/fabio?size=200x200', 'admin', true, '2024-01-15 10:30:00'),
('María González', 'maria.gonzalez@email.com', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://robohash.org/maria?size=200x200', 'usuario', true, '2024-02-20 09:15:00'),
('Carlos Rodríguez', 'carlos.rodriguez@email.com', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://robohash.org/carlos?size=200x200', 'donador', true, '2024-01-10 11:20:00'),
('Ana Martínez', 'ana.martinez@email.com', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://robohash.org/ana?size=200x200', 'usuario', true, '2024-03-01 14:00:00'),
('Luis Pérez', 'luis.perez@email.com', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://robohash.org/luis?size=200x200', 'donador', false, '2024-02-05 08:45:00'),
('Sofia Herrera', 'sofia.herrera@email.com', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://robohash.org/sofia?size=200x200', 'usuario', true, '2024-03-15 12:30:00'),
('Diego Morales', 'diego.morales@email.com', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://robohash.org/diego?size=200x200', 'donador', true, '2024-02-28 15:45:00'),
('Carmen Silva', 'carmen.silva@email.com', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://robohash.org/carmen?size=200x200', 'usuario', true, '2024-03-10 10:20:00'),
('Roberto Jiménez', 'roberto.jimenez@email.com', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://robohash.org/roberto?size=200x200', 'usuario', true, '2024-03-20 16:15:00'),
('Patricia López', 'patricia.lopez@email.com', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://robohash.org/patricia?size=200x200', 'donador', true, '2024-02-15 13:30:00'),
('Miguel Castro', 'miguel.castro@email.com', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://robohash.org/miguel?size=200x200', 'usuario', true, '2024-03-25 11:45:00'),
('Laura Vargas', 'laura.vargas@email.com', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://robohash.org/laura?size=200x200', 'usuario', true, '2024-03-18 09:20:00'),
('Fernando Ruiz', 'fernando.ruiz@email.com', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://robohash.org/fernando?size=200x200', 'donador', true, '2024-01-25 14:10:00'),
('Isabel Moreno', 'isabel.moreno@email.com', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://robohash.org/isabel?size=200x200', 'usuario', true, '2024-03-22 10:30:00'),
('Javier Torres', 'javier.torres@email.com', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://robohash.org/javier?size=200x200', 'usuario', true, '2024-03-12 15:25:00');

-- Verificar que se insertaron correctamente
SELECT COUNT(*) as total_users FROM "Users" WHERE "Activo" = true;

-- Ver usuarios por rol
SELECT "Rol", COUNT(*) as count 
FROM "Users" 
WHERE "Activo" = true 
GROUP BY "Rol" 
ORDER BY count DESC;

-- Ver usuarios nuevos del mes actual
SELECT COUNT(*) as new_users_this_month 
FROM "Users" 
WHERE "Activo" = true 
AND EXTRACT(MONTH FROM "FechaCreacion") = EXTRACT(MONTH FROM CURRENT_DATE)
AND EXTRACT(YEAR FROM "FechaCreacion") = EXTRACT(YEAR FROM CURRENT_DATE); 