# Configuración de Terraform para VirtualBiblio
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configurar el proveedor AWS
provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "Región de AWS"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
  default     = "virtualbiblio"
}

variable "environment" {
  description = "Ambiente de despliegue"
  type        = string
  default     = "production"
}

# Tags comunes
locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    Owner       = "Fabio Torres"
  }
}

# VPC para la aplicación
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-vpc"
  })
}

# Subred pública
resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.aws_region}a"

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-public-subnet"
  })
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-igw"
  })
}

# Tabla de rutas
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-public-rt"
  })
}

# Asociar tabla de rutas con subred
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Security Group para la aplicación
resource "aws_security_group" "app" {
  name        = "${var.project_name}-app-sg"
  description = "Security group para la aplicación VirtualBiblio"
  vpc_id      = aws_vpc.main.id

  # Puerto HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Puerto HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Puerto SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Puerto de la aplicación .NET
  ingress {
    from_port   = 5084
    to_port     = 5084
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Puerto de la aplicación React
  ingress {
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Todo el tráfico saliente
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

# Outputs
output "vpc_id" {
  description = "ID de la VPC"
  value       = aws_vpc.main.id
}

output "subnet_id" {
  description = "ID de la subred pública"
  value       = aws_subnet.public.id
}

output "security_group_id" {
  description = "ID del security group"
  value       = aws_security_group.app.id
} 