#!/bin/bash

# Colores para los mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuración
ENVIRONMENT=${1:-prod}
STACK_NAME="neurofin-frontend-$ENVIRONMENT"
REGION="us-east-1"

echo -e "${YELLOW}Iniciando despliegue para el ambiente: $ENVIRONMENT${NC}"

# Construir la aplicación
echo -e "${YELLOW}Construyendo la aplicación...${NC}"
cd frontend
npm run build
cd ..

# Desplegar la infraestructura con SAM
echo -e "${YELLOW}Desplegando infraestructura con SAM...${NC}"
sam deploy \
  --template-file template.yaml \
  --stack-name $STACK_NAME \
  --region $REGION \
  --parameter-overrides Environment=$ENVIRONMENT \
  --capabilities CAPABILITY_IAM \
  --no-fail-on-empty-changeset

# Obtener el nombre del bucket y el ID de distribución de CloudFront
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue' \
  --output text \
  --region $REGION)

DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text \
  --region $REGION)

# Subir archivos al bucket S3
echo -e "${YELLOW}Subiendo archivos al bucket S3...${NC}"
aws s3 sync frontend/build/ s3://$BUCKET_NAME/ \
  --delete \
  --cache-control "max-age=31536000" \
  --region $REGION

# Configurar Cache-Control específico para index.html
aws s3 cp frontend/build/index.html s3://$BUCKET_NAME/index.html \
  --cache-control "no-cache" \
  --region $REGION

# Crear invalidación en CloudFront
echo -e "${YELLOW}Creando invalidación en CloudFront...${NC}"
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*" \
  --region $REGION

echo -e "${GREEN}¡Despliegue completado exitosamente!${NC}"

# Obtener el dominio de CloudFront
CLOUDFRONT_DOMAIN=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
  --output text \
  --region $REGION)

echo -e "${GREEN}La aplicación está disponible en: https://$CLOUDFRONT_DOMAIN${NC}" 