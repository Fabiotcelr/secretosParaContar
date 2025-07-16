#!/bin/bash

# Script de configuración para AWS CLI - VirtualBiblio
# Este script configura AWS CLI y crea los recursos necesarios

echo "🚀 Configurando AWS CLI para VirtualBiblio..."

# Verificar si AWS CLI está instalado
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI no está instalado. Por favor instálalo primero."
    echo "📥 Descarga desde: https://aws.amazon.com/cli/"
    exit 1
fi

# Verificar si Terraform está instalado
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform no está instalado. Por favor instálalo primero."
    echo "📥 Descarga desde: https://www.terraform.io/downloads.html"
    exit 1
fi

echo "✅ Herramientas verificadas"

# Configurar AWS CLI
echo "🔧 Configurando AWS CLI..."
aws configure

# Crear key pair para SSH
echo "🔑 Creando key pair para SSH..."
aws ec2 create-key-pair \
    --key-name virtualbiblio-key \
    --query 'KeyMaterial' \
    --output text > virtualbiblio-key.pem

chmod 400 virtualbiblio-key.pem
echo "✅ Key pair creada: virtualbiblio-key.pem"

# Crear bucket S3 para Terraform state
echo "🪣 Creando bucket S3 para Terraform state..."
aws s3 mb s3://virtualbiblio-terraform-state

# Habilitar versioning en el bucket
aws s3api put-bucket-versioning \
    --bucket virtualbiblio-terraform-state \
    --versioning-configuration Status=Enabled

echo "✅ Bucket S3 creado: virtualbiblio-terraform-state"

# Crear DynamoDB table para state locking
echo "🗄️ Creando tabla DynamoDB para state locking..."
aws dynamodb create-table \
    --table-name virtualbiblio-terraform-locks \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

echo "✅ Tabla DynamoDB creada: virtualbiblio-terraform-locks"

# Crear archivo de configuración para Terraform backend
cat > terraform/backend.tf << EOF
terraform {
  backend "s3" {
    bucket         = "virtualbiblio-terraform-state"
    key            = "virtualbiblio/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "virtualbiblio-terraform-locks"
    encrypt        = true
  }
}
EOF

echo "✅ Archivo backend.tf creado"

# Crear archivo de variables de ejemplo
cat > terraform/terraform.tfvars.example << EOF
# Variables de ejemplo para Terraform
# Copia este archivo a terraform.tfvars y ajusta los valores

aws_region = "us-east-1"
project_name = "virtualbiblio"
environment = "production"
instance_type = "t3.micro"
domain_name = "virtualbiblio.com"
db_username = "postgres"
db_password = "tu_password_seguro_aqui"
db_name = "virtualbiblio"
EOF

echo "✅ Archivo terraform.tfvars.example creado"

echo ""
echo "🎉 Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Copia terraform.tfvars.example a terraform.tfvars"
echo "2. Edita terraform.tfvars con tus valores"
echo "3. Ejecuta: cd terraform && terraform init"
echo "4. Ejecuta: terraform plan"
echo "5. Ejecuta: terraform apply"
echo ""
echo "🔐 Recuerda guardar la key pair (virtualbiblio-key.pem) en un lugar seguro"
echo "📁 El bucket S3 y la tabla DynamoDB están listos para usar" 