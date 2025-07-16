# 🚀 Guía de Despliegue - VirtualBiblio

Esta guía te ayudará a desplegar VirtualBiblio en AWS usando Terraform y AWS CLI.

## 📋 Prerrequisitos

### Herramientas necesarias
- **AWS CLI** v2.x
- **Terraform** v1.0+
- **Git**
- **.NET 9 SDK**
- **Node.js** 18+
- **PostgreSQL** (para desarrollo local)

### Cuenta AWS
- Cuenta AWS activa
- Usuario IAM con permisos para:
  - EC2
  - S3
  - DynamoDB
  - VPC
  - IAM
  - RDS (opcional)

## 🔧 Configuración Inicial

### 1. Configurar AWS CLI
```bash
aws configure
```
Ingresa:
- AWS Access Key ID
- AWS Secret Access Key
- Default region: `us-east-1`
- Default output format: `json`

### 2. Ejecutar script de configuración
```bash
chmod +x aws-config/aws-config.sh
./aws-config/aws-config.sh
```

Este script creará:
- Key pair para SSH
- Bucket S3 para Terraform state
- Tabla DynamoDB para state locking
- Archivos de configuración

## 🏗️ Infraestructura con Terraform

### 1. Configurar variables
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edita `terraform.tfvars` con tus valores:
```hcl
aws_region = "us-east-1"
project_name = "virtualbiblio"
environment = "production"
instance_type = "t3.micro"
domain_name = "virtualbiblio.com"
db_username = "postgres"
db_password = "tu_password_seguro_aqui"
db_name = "virtualbiblio"
```

### 2. Inicializar Terraform
```bash
terraform init
```

### 3. Planificar el despliegue
```bash
terraform plan
```

### 4. Aplicar la infraestructura
```bash
terraform apply
```

## 🖥️ Configuración de la Instancia EC2

### 1. Conectar a la instancia
```bash
ssh -i virtualbiblio-key.pem ubuntu@<IP_PUBLICA>
```

### 2. Instalar dependencias
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar .NET 9
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt update
sudo apt install -y dotnet-sdk-9.0

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Instalar Nginx
sudo apt install -y nginx
```

### 3. Configurar PostgreSQL
```bash
sudo -u postgres psql
CREATE DATABASE virtualbiblio;
CREATE USER virtualbiblio WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE virtualbiblio TO virtualbiblio;
\q
```

### 4. Configurar firewall
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 5084
sudo ufw allow 5173
sudo ufw enable
```

## 📦 Despliegue de la Aplicación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/secretosparacontar.git
cd secretosparacontar
```

### 2. Configurar backend
```bash
cd backend
cp appsettings.Development.json appsettings.Production.json
```

Edita `appsettings.Production.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=virtualbiblio;Username=virtualbiblio;Password=tu_password"
  },
  "JwtSettings": {
    "SecretKey": "tu_clave_secreta_super_larga_y_segura_aqui_minimo_32_caracteres",
    "Issuer": "VirtualBiblio",
    "Audience": "VirtualBiblioUsers",
    "ExpirationHours": 24
  }
}
```

### 3. Ejecutar migraciones
```bash
dotnet ef database update
```

### 4. Publicar backend
```bash
dotnet publish -c Release -o /var/www/virtualbiblio-api
```

### 5. Configurar servicio systemd para backend
```bash
sudo nano /etc/systemd/system/virtualbiblio-api.service
```

Contenido:
```ini
[Unit]
Description=VirtualBiblio API
After=network.target

[Service]
Type=exec
User=www-data
WorkingDirectory=/var/www/virtualbiblio-api
ExecStart=/usr/bin/dotnet VirtualBiblio.dll
Restart=always
RestartSec=10
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://localhost:5084

[Install]
WantedBy=multi-user.target
```

### 6. Iniciar servicio backend
```bash
sudo systemctl enable virtualbiblio-api
sudo systemctl start virtualbiblio-api
```

### 7. Configurar frontend
```bash
cd frontend/Katrina
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

### 8. Configurar Nginx
```bash
sudo nano /etc/nginx/sites-available/virtualbiblio
```

Contenido:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5084;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 9. Habilitar sitio
```bash
sudo ln -s /etc/nginx/sites-available/virtualbiblio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Configuración de SSL (Opcional)

### 1. Instalar Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obtener certificado SSL
```bash
sudo certbot --nginx -d tu-dominio.com
```

## 📊 Monitoreo y Logs

### Ver logs del backend
```bash
sudo journalctl -u virtualbiblio-api -f
```

### Ver logs de Nginx
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔄 Actualizaciones

### 1. Actualizar backend
```bash
cd /path/to/secretosparacontar/backend
git pull
dotnet publish -c Release -o /var/www/virtualbiblio-api
sudo systemctl restart virtualbiblio-api
```

### 2. Actualizar frontend
```bash
cd /path/to/secretosparacontar/frontend/Katrina
git pull
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

## 🗑️ Limpieza

### Destruir infraestructura
```bash
cd terraform
terraform destroy
```

### Eliminar recursos AWS
```bash
aws s3 rb s3://virtualbiblio-terraform-state --force
aws dynamodb delete-table --table-name virtualbiblio-terraform-locks
aws ec2 delete-key-pair --key-name virtualbiblio-key
```

## 🆘 Troubleshooting

### Problemas comunes

1. **Error de conexión a la base de datos**
   - Verificar configuración de PostgreSQL
   - Revisar connection string

2. **Error de permisos**
   - Verificar permisos de archivos
   - Revisar configuración de usuario www-data

3. **Error de CORS**
   - Verificar configuración en Program.cs
   - Revisar headers de Nginx

4. **Error de JWT**
   - Verificar SecretKey en appsettings
   - Revisar configuración de autenticación

## 📞 Soporte

Para problemas específicos:
- Revisar logs del sistema
- Verificar configuración de servicios
- Consultar documentación oficial de AWS y Terraform 