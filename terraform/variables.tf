# Variables para Terraform - VirtualBiblio

variable "aws_region" {
  description = "Región de AWS donde se desplegará la infraestructura"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
  default     = "virtualbiblio"
}

variable "environment" {
  description = "Ambiente de despliegue (development, staging, production)"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block para la VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block para la subred pública"
  type        = string
  default     = "10.0.1.0/24"
}

variable "instance_type" {
  description = "Tipo de instancia EC2"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Nombre de la key pair para SSH"
  type        = string
  default     = "virtualbiblio-key"
}

variable "domain_name" {
  description = "Nombre de dominio para la aplicación"
  type        = string
  default     = "virtualbiblio.com"
}

variable "db_username" {
  description = "Usuario de la base de datos"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Contraseña de la base de datos"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Nombre de la base de datos"
  type        = string
  default     = "virtualbiblio"
} 