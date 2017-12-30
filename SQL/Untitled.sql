SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema cocinasketapa1
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `cocinasketapa1` DEFAULT CHARACTER SET utf8 ;
USE `cocinasketapa1` ;

-- -----------------------------------------------------
-- Table `cocinasketapa1`.`MedioContacto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`MedioContacto` (
  `MedioContactoId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`MedioContactoId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoMedioContacto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoMedioContacto` (
  `TipoMedioContactoId` INT NOT NULL AUTO_INCREMENT,
  `MedioContactoId` INT NOT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`TipoMedioContactoId`),
  INDEX `MedioContactoId_idx` (`MedioContactoId` ASC),
  CONSTRAINT `MedioContactoId`
    FOREIGN KEY (`MedioContactoId`)
    REFERENCES `cocinasketapa1`.`MedioContacto` (`MedioContactoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`MedioCaptacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`MedioCaptacion` (
  `MedioCaptacionId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`MedioCaptacionId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Pais`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Pais` (
  `PaisId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`PaisId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Empresa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Empresa` (
  `EmpresaId` INT NOT NULL AUTO_INCREMENT,
  `PaisId` INT NOT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  `RFC` VARCHAR(15) NOT NULL,
  `email` VARCHAR(120) NOT NULL,
  `Domicilio` VARCHAR(120) NOT NULL,
  `Estado` VARCHAR(50) NOT NULL,
  `Municipio` VARCHAR(80) NOT NULL,
  `Ciudad` VARCHAR(80) NOT NULL,
  `Colonia` VARCHAR(80) NOT NULL,
  `Codigo` VARCHAR(5) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`EmpresaId`),
  INDEX `PaisId_idx` (`PaisId` ASC),
  CONSTRAINT `PaisId`
    FOREIGN KEY (`PaisId`)
    REFERENCES `cocinasketapa1`.`Pais` (`PaisId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`MarcaEquipo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`MarcaEquipo` (
  `MarcaEquipoId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`MarcaEquipoId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Color`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Color` (
  `ColorId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  `Imagen` LONGBLOB NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`ColorId`),
  UNIQUE INDEX `Nombre_UNIQUE` (`Nombre` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoProducto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoProducto` (
  `TipoProductoId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`TipoProductoId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoProyecto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoProyecto` (
  `TipoProyectoId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  `IVA` TINYINT(1) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`TipoProyectoId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Cuenta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Cuenta` (
  `CuentaId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  `Banco` VARCHAR(120) NOT NULL,
  `Cuenta` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`CuentaId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Colaborador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Colaborador` (
  `ColaboradorId` INT NOT NULL AUTO_INCREMENT,
  `UnidadNegocioId` INT NOT NULL,
  `PaisId` INT NOT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  `PrimerApellido` VARCHAR(120) NOT NULL,
  `SegundoApellido` VARCHAR(120) NOT NULL,
  `Domicilio` VARCHAR(120) NOT NULL,
  `Estado` VARCHAR(50) NOT NULL,
  `Ciudad` VARCHAR(80) NOT NULL,
  `Codigo` VARCHAR(5) NOT NULL,
  `Colonia` VARCHAR(80) NOT NULL,
  `Municipio` VARCHAR(80) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`ColaboradorId`),
  INDEX `SucursalId_idx` (`UnidadNegocioId` ASC),
  INDEX `PaisColaborador_idx` (`PaisId` ASC),
  CONSTRAINT `Sucursal`
    FOREIGN KEY (`UnidadNegocioId`)
    REFERENCES `cocinasketapa1`.`UnidadNegocio` (`UnidadNegocioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `PaisColaborador`
    FOREIGN KEY (`PaisId`)
    REFERENCES `cocinasketapa1`.`Pais` (`PaisId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoUnidadNegocio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoUnidadNegocio` (
  `TipoUnidadNegocioId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`TipoUnidadNegocioId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`UnidadNegocio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`UnidadNegocio` (
  `UnidadNegocioId` INT NOT NULL AUTO_INCREMENT,
  `ColaboradorId` INT NULL,
  `EmpresaId` INT NOT NULL,
  `TipoUnidadNegocioId` INT NOT NULL,
  `PaisId` INT NOT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  `Telefono` VARCHAR(20) NOT NULL,
  `Colonia` VARCHAR(80) NOT NULL,
  `Estado` VARCHAR(80) NOT NULL,
  `Ciudad` VARCHAR(80) NOT NULL,
  `Codigo` VARCHAR(5) NOT NULL,
  `Municipio` VARCHAR(80) NOT NULL,
  `Domicilio` VARCHAR(120) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`UnidadNegocioId`),
  INDEX `EmpresaId_idx` (`EmpresaId` ASC),
  INDEX `ColaboradorSucursal_idx` (`ColaboradorId` ASC),
  INDEX `TipoUnidadNegocio_idx` (`TipoUnidadNegocioId` ASC),
  INDEX `PaisIdUnidadNegocio_idx` (`PaisId` ASC),
  CONSTRAINT `EmpresaId`
    FOREIGN KEY (`EmpresaId`)
    REFERENCES `cocinasketapa1`.`Empresa` (`EmpresaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ColaboradorSucursal`
    FOREIGN KEY (`ColaboradorId`)
    REFERENCES `cocinasketapa1`.`Colaborador` (`ColaboradorId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `TipoUnidadNegocio`
    FOREIGN KEY (`TipoUnidadNegocioId`)
    REFERENCES `cocinasketapa1`.`TipoUnidadNegocio` (`TipoUnidadNegocioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `PaisIdUnidadNegocio`
    FOREIGN KEY (`PaisId`)
    REFERENCES `cocinasketapa1`.`Pais` (`PaisId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Territorio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Territorio` (
  `TerritorioId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  `Margen` FLOAT NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`TerritorioId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Plaza`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Plaza` (
  `PlazaId` INT NOT NULL AUTO_INCREMENT,
  `UnidadNegocioId` INT NOT NULL,
  `TerritorioId` INT NOT NULL,
  `Estado` VARCHAR(80) NOT NULL,
  `Municipio` VARCHAR(80) NOT NULL,
  `Ciudad` VARCHAR(80) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`PlazaId`),
  INDEX `SucursalId_idx` (`UnidadNegocioId` ASC),
  UNIQUE INDEX `Estado_UNIQUE` (`Estado` ASC, `Municipio` ASC, `Ciudad` ASC),
  INDEX `TerritorioId_idx` (`TerritorioId` ASC),
  CONSTRAINT `SucursalId`
    FOREIGN KEY (`UnidadNegocioId`)
    REFERENCES `cocinasketapa1`.`UnidadNegocio` (`UnidadNegocioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `TerritorioId`
    FOREIGN KEY (`TerritorioId`)
    REFERENCES `cocinasketapa1`.`Territorio` (`TerritorioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Proveedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Proveedor` (
  `ProveedorId` INT NOT NULL AUTO_INCREMENT,
  `PaisId` INT NOT NULL,
  `Nombre` VARCHAR(80) NOT NULL,
  `RFC` VARCHAR(15) NOT NULL,
  `NombreContacto` VARCHAR(120) NOT NULL,
  `TelefonoContacto` VARCHAR(23) NOT NULL,
  `EmailContacto` VARCHAR(120) NOT NULL,
  `PuestoContacto` VARCHAR(120) NOT NULL,
  `CodigoPostal` VARCHAR(5) NOT NULL,
  `Domicilio` VARCHAR(120) NOT NULL,
  `Estado` VARCHAR(50) NOT NULL,
  `Ciudad` VARCHAR(80) NOT NULL,
  `Municipio` VARCHAR(80) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`ProveedorId`),
  INDEX `PaisProveedor_idx` (`PaisId` ASC),
  CONSTRAINT `PaisProveedor`
    FOREIGN KEY (`PaisId`)
    REFERENCES `cocinasketapa1`.`Pais` (`PaisId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Producto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Producto` (
  `ProductoId` INT NOT NULL AUTO_INCREMENT,
  `TipoProductoId` INT NOT NULL,
  `Nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`ProductoId`),
  INDEX `TipoProductoId_idx` (`TipoProductoId` ASC),
  CONSTRAINT `TipoProductoId`
    FOREIGN KEY (`TipoProductoId`)
    REFERENCES `cocinasketapa1`.`TipoProducto` (`TipoProductoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Equipo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Equipo` (
  `EquipoId` INT NOT NULL AUTO_INCREMENT,
  `MarcaEquipoId` INT NOT NULL,
  `ProductoId` INT NOT NULL,
  `Imagen` BLOB NOT NULL,
  `Modelo` VARCHAR(120) NOT NULL,
  `Descripcion` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`EquipoId`),
  INDEX `MarcaProductoId_idx` (`MarcaEquipoId` ASC),
  INDEX `ProductoId_idx` (`ProductoId` ASC),
  CONSTRAINT `MarcaId`
    FOREIGN KEY (`MarcaEquipoId`)
    REFERENCES `cocinasketapa1`.`MarcaEquipo` (`MarcaEquipoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `EquipoProducto`
    FOREIGN KEY (`ProductoId`)
    REFERENCES `cocinasketapa1`.`Producto` (`ProductoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ColorPorEquipo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ColorPorEquipo` (
  `ColorPorEquipoId` INT NOT NULL AUTO_INCREMENT,
  `ColorId` INT NOT NULL,
  `EquipoId` INT NOT NULL,
  `Costo` DECIMAL(2) NOT NULL,
  `Precio` DECIMAL(2) NOT NULL,
  PRIMARY KEY (`ColorPorEquipoId`),
  INDEX `ColorProductoId_idx` (`ColorId` ASC),
  INDEX `ProductoId_idx` (`EquipoId` ASC),
  CONSTRAINT `ColorPorProductoId`
    FOREIGN KEY (`ColorId`)
    REFERENCES `cocinasketapa1`.`Color` (`ColorId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ColorEquipoId`
    FOREIGN KEY (`EquipoId`)
    REFERENCES `cocinasketapa1`.`Equipo` (`EquipoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`EquipoPorProveedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`EquipoPorProveedor` (
  `EquipoPorProveedorId` INT NOT NULL AUTO_INCREMENT,
  `ProveedorId` INT NOT NULL,
  `ColorPorEquipoId` INT NOT NULL,
  PRIMARY KEY (`EquipoPorProveedorId`),
  INDEX `ProductoProveedor_idx` (`ProveedorId` ASC),
  CONSTRAINT `EquipoProveedor`
    FOREIGN KEY (`ProveedorId`)
    REFERENCES `cocinasketapa1`.`Proveedor` (`ProveedorId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ColorPorEquipoId`
    FOREIGN KEY (`ColorPorEquipoId`)
    REFERENCES `cocinasketapa1`.`ColorPorEquipo` (`ColorPorEquipoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`PlanPago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`PlanPago` (
  `PlanPagoId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  `Pagos` INT NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  `FechaEntrega` SMALLINT(6) NOT NULL,
  PRIMARY KEY (`PlanPagoId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`PlanPagoAbono`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`PlanPagoAbono` (
  `PlanPagoAbonoId` INT NOT NULL AUTO_INCREMENT,
  `PlanPagoId` INT NOT NULL,
  `Abono` DECIMAL(5,2) NOT NULL,
  `NumeroAbono` INT NOT NULL,
  `Dias` INT NOT NULL,
  PRIMARY KEY (`PlanPagoAbonoId`),
  INDEX `PlanPagoId_idx` (`PlanPagoId` ASC),
  CONSTRAINT `PlanPagoId`
    FOREIGN KEY (`PlanPagoId`)
    REFERENCES `cocinasketapa1`.`PlanPago` (`PlanPagoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ContactoColaborador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ContactoColaborador` (
  `MedioContactoColaboradorId` INT NOT NULL AUTO_INCREMENT,
  `TipoMedioContactoId` INT NOT NULL,
  `ColaboradorId` INT NOT NULL,
  `Contacto` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`MedioContactoColaboradorId`),
  INDEX `ColaboradorId_idx` (`ColaboradorId` ASC),
  INDEX `TipoMedioContactoId_idx` (`TipoMedioContactoId` ASC),
  CONSTRAINT `ColaboradorId`
    FOREIGN KEY (`ColaboradorId`)
    REFERENCES `cocinasketapa1`.`Colaborador` (`ColaboradorId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `TipoMedioContactoId`
    FOREIGN KEY (`TipoMedioContactoId`)
    REFERENCES `cocinasketapa1`.`TipoMedioContacto` (`TipoMedioContactoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Usuario` (
  `UsuarioId` INT NOT NULL AUTO_INCREMENT,
  `ColaboradorId` INT NOT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  `Password` VARCHAR(120) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`UsuarioId`),
  INDEX `ColaboradorId_idx` (`ColaboradorId` ASC),
  CONSTRAINT `Colaborador`
    FOREIGN KEY (`ColaboradorId`)
    REFERENCES `cocinasketapa1`.`Colaborador` (`ColaboradorId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Perfil`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Perfil` (
  `PerfilId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`PerfilId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ModuloGUI`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ModuloGUI` (
  `ModuloGUIId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`ModuloGUIId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Permiso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Permiso` (
  `PermisoId` INT NOT NULL AUTO_INCREMENT,
  `PerfilId` INT NOT NULL,
  `ModuloGUIId` INT NOT NULL,
  `Seccion` VARCHAR(120) NOT NULL,
  `Operacion` VARCHAR(45) NOT NULL,
  `Clave` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`PermisoId`),
  UNIQUE INDEX `Clave_UNIQUE` (`Clave` ASC),
  INDEX `PerfilPorPermisoId_idx` (`PerfilId` ASC),
  INDEX `ModuloId_idx` (`ModuloGUIId` ASC),
  CONSTRAINT `PerfilPorPermisoId`
    FOREIGN KEY (`PerfilId`)
    REFERENCES `cocinasketapa1`.`Perfil` (`PerfilId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ModuloId`
    FOREIGN KEY (`ModuloGUIId`)
    REFERENCES `cocinasketapa1`.`ModuloGUI` (`ModuloGUIId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`PerfilPorUsuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`PerfilPorUsuario` (
  `PerfilPorUsuarioId` INT NOT NULL AUTO_INCREMENT,
  `PerfilId` INT NOT NULL,
  `UsuarioId` INT NOT NULL,
  PRIMARY KEY (`PerfilPorUsuarioId`),
  INDEX `UsuarioId_idx` (`UsuarioId` ASC),
  INDEX `PerfilId_idx` (`PerfilId` ASC),
  CONSTRAINT `Usuario`
    FOREIGN KEY (`UsuarioId`)
    REFERENCES `cocinasketapa1`.`Usuario` (`UsuarioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Perfil`
    FOREIGN KEY (`PerfilId`)
    REFERENCES `cocinasketapa1`.`Perfil` (`PerfilId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`PermisoPorUsuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`PermisoPorUsuario` (
  `PermisoPorUsuarioId` INT NOT NULL AUTO_INCREMENT,
  `UsuarioId` INT NOT NULL,
  `PermisoId` INT NOT NULL,
  PRIMARY KEY (`PermisoPorUsuarioId`),
  INDEX `UsuarioId_idx` (`UsuarioId` ASC),
  INDEX `PermisoUsuarioId_idx` (`PermisoId` ASC),
  CONSTRAINT `UsuarioId`
    FOREIGN KEY (`UsuarioId`)
    REFERENCES `cocinasketapa1`.`Usuario` (`UsuarioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `PermisoUsuarioId`
    FOREIGN KEY (`PermisoId`)
    REFERENCES `cocinasketapa1`.`Permiso` (`PermisoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Deposito`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Deposito` (
  `DepositoId` INT NOT NULL AUTO_INCREMENT,
  `CuentaId` INT NOT NULL,
  `UsuarioId` INT NOT NULL,
  `Fecha` DATETIME NOT NULL,
  `Importe` DECIMAL(2) NOT NULL,
  PRIMARY KEY (`DepositoId`),
  INDEX `CuentaBancariaId_idx` (`CuentaId` ASC),
  INDEX `UsuarioId_idx` (`UsuarioId` ASC),
  CONSTRAINT `CuentaDeposito`
    FOREIGN KEY (`CuentaId`)
    REFERENCES `cocinasketapa1`.`Cuenta` (`CuentaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `UsuarioDeposito`
    FOREIGN KEY (`UsuarioId`)
    REFERENCES `cocinasketapa1`.`Usuario` (`UsuarioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoPersona`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoPersona` (
  `TipoPersonaId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`TipoPersonaId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Persona`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Persona` (
  `PersonaId` INT NOT NULL AUTO_INCREMENT,
  `MedioCaptacionId` INT NOT NULL,
  `TipoPersonaId` INT NOT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  `PrimerApellido` VARCHAR(80) NOT NULL,
  `SegundoApellido` VARCHAR(80) NOT NULL,
  `NombreMedioCaptacion` VARCHAR(120) NULL,
  PRIMARY KEY (`PersonaId`),
  INDEX `MedioCaptacionId_idx` (`MedioCaptacionId` ASC),
  INDEX `EstatusPersonaId_idx` (`TipoPersonaId` ASC),
  CONSTRAINT `MedioCaptacionId`
    FOREIGN KEY (`MedioCaptacionId`)
    REFERENCES `cocinasketapa1`.`MedioCaptacion` (`MedioCaptacionId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `EstatusPersonaId`
    FOREIGN KEY (`TipoPersonaId`)
    REFERENCES `cocinasketapa1`.`TipoPersona` (`TipoPersonaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Venta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Venta` (
  `VentaId` INT NOT NULL AUTO_INCREMENT,
  `ClienteId` INT NULL,
  `UsuarioId` INT NOT NULL,
  `UsuarioIdCancelacion` INT NULL,
  `Fecha` DATETIME NOT NULL,
  `Total` DECIMAL(2) NOT NULL,
  `IVA` DECIMAL(2) NOT NULL,
  `Subtotal` DECIMAL(2) NOT NULL,
  `FechaCancelacion` DATETIME NULL,
  PRIMARY KEY (`VentaId`),
  INDEX `ClienteId_idx` (`ClienteId` ASC),
  INDEX `UsuarioId_idx` (`UsuarioId` ASC),
  INDEX `CancelacionUsuario_idx` (`UsuarioIdCancelacion` ASC),
  CONSTRAINT `Cliente`
    FOREIGN KEY (`ClienteId`)
    REFERENCES `cocinasketapa1`.`Persona` (`PersonaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `UsuarioVenta`
    FOREIGN KEY (`UsuarioId`)
    REFERENCES `cocinasketapa1`.`Usuario` (`UsuarioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `CancelacionUsuario`
    FOREIGN KEY (`UsuarioIdCancelacion`)
    REFERENCES `cocinasketapa1`.`Usuario` (`UsuarioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`FormaPago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`FormaPago` (
  `FormaPagoId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`FormaPagoId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`VentaPorProducto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`VentaPorProducto` (
  `VentaPorProductoId` INT NOT NULL AUTO_INCREMENT,
  `VentaId` INT NOT NULL,
  `ColorPorProductoId` INT NOT NULL,
  `Total` DECIMAL(2) NOT NULL,
  `IVA` DECIMAL(2) NOT NULL,
  `Subtotal` DECIMAL(2) NOT NULL,
  `Descuento` INT NOT NULL,
  PRIMARY KEY (`VentaPorProductoId`),
  INDEX `VentaId_idx` (`VentaId` ASC),
  CONSTRAINT `VentaId`
    FOREIGN KEY (`VentaId`)
    REFERENCES `cocinasketapa1`.`Venta` (`VentaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ColorPorPriductoId`
    FOREIGN KEY (`ColorPorProductoId`)
    REFERENCES `cocinasketapa1`.`ColorPorEquipo` (`ColorPorEquipoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ContactoPersona`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ContactoPersona` (
  `ContactoPersonaId` INT NOT NULL AUTO_INCREMENT,
  `TipoMedioContactoId` INT NOT NULL,
  `PersonaId` INT NOT NULL,
  `Contacto` VARCHAR(120) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`ContactoPersonaId`),
  INDEX `ClienteId_idx` (`PersonaId` ASC),
  INDEX `TipoMedioContactoId_idx` (`TipoMedioContactoId` ASC),
  CONSTRAINT `ClienteContacto`
    FOREIGN KEY (`PersonaId`)
    REFERENCES `cocinasketapa1`.`Persona` (`PersonaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `TipoMedioContacto`
    FOREIGN KEY (`TipoMedioContactoId`)
    REFERENCES `cocinasketapa1`.`TipoMedioContacto` (`TipoMedioContactoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`DireccionPersona`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`DireccionPersona` (
  `DireccionPersonaId` INT NOT NULL AUTO_INCREMENT,
  `TipoMedioContactoId` INT NOT NULL,
  `PersonaId` INT NOT NULL,
  `PaisId` INT NOT NULL,
  `Codigo` VARCHAR(5) NOT NULL,
  `Estado` VARCHAR(50) NOT NULL,
  `Ciudad` VARCHAR(80) NOT NULL,
  `Domicilio` VARCHAR(80) NOT NULL,
  `Municipio` VARCHAR(80) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`DireccionPersonaId`),
  INDEX `TipoMedioContactoId_idx` (`TipoMedioContactoId` ASC),
  INDEX `CllienteId_idx` (`PersonaId` ASC),
  INDEX `PaisIdCliente_idx` (`PaisId` ASC),
  CONSTRAINT `CllienteDireccion`
    FOREIGN KEY (`PersonaId`)
    REFERENCES `cocinasketapa1`.`Persona` (`PersonaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `TipoMedioContactoDireccion`
    FOREIGN KEY (`TipoMedioContactoId`)
    REFERENCES `cocinasketapa1`.`TipoMedioContacto` (`TipoMedioContactoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `PaisIdCliente`
    FOREIGN KEY (`PaisId`)
    REFERENCES `cocinasketapa1`.`Pais` (`PaisId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoOperacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoOperacion` (
  `TipoOperacionId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`TipoOperacionId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`UsuarioBitacora`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`UsuarioBitacora` (
  `UsuarioBitacoraId` INT NOT NULL AUTO_INCREMENT,
  `UsuarioId` INT NOT NULL,
  `TipoOperacionId` INT NOT NULL,
  `Fecha` DATETIME NOT NULL,
  `Descripcion` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`UsuarioBitacoraId`),
  INDEX `UsuarioId_idx` (`UsuarioId` ASC),
  INDEX `TipoOperacionId_idx` (`TipoOperacionId` ASC),
  CONSTRAINT `UsuarioBitacora`
    FOREIGN KEY (`UsuarioId`)
    REFERENCES `cocinasketapa1`.`Usuario` (`UsuarioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `TipoOperacionId`
    FOREIGN KEY (`TipoOperacionId`)
    REFERENCES `cocinasketapa1`.`TipoOperacion` (`TipoOperacionId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TareaCita`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TareaCita` (
  `TareaCitaId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`TareaCitaId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`EstatusCita`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`EstatusCita` (
  `EstatusCitaId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`EstatusCitaId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`EstatusProyecto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`EstatusProyecto` (
  `EstatusProyectoId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`EstatusProyectoId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Proyecto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Proyecto` (
  `ProyectoId` INT NOT NULL AUTO_INCREMENT,
  `PersonaId` INT NOT NULL,
  `TipoProyectoId` INT NOT NULL,
  `EstatusProyectoId` INT NOT NULL,
  `DomicilioPersona` INT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  `Medidas` LONGBLOB NOT NULL,
  `Comentario` VARCHAR(1000) NOT NULL,
  PRIMARY KEY (`ProyectoId`),
  INDEX `ClienteId_idx` (`PersonaId` ASC),
  INDEX `TipoProyectoId_idx` (`TipoProyectoId` ASC),
  INDEX `EstatusProyectoId_idx` (`EstatusProyectoId` ASC),
  INDEX `DireccionClienteId_idx` (`DomicilioPersona` ASC),
  CONSTRAINT `ClienteId`
    FOREIGN KEY (`PersonaId`)
    REFERENCES `cocinasketapa1`.`Persona` (`PersonaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `TipoProyectoId`
    FOREIGN KEY (`TipoProyectoId`)
    REFERENCES `cocinasketapa1`.`TipoProyecto` (`TipoProyectoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `EstatusProyectoId`
    FOREIGN KEY (`EstatusProyectoId`)
    REFERENCES `cocinasketapa1`.`EstatusProyecto` (`EstatusProyectoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `DireccionClienteId`
    FOREIGN KEY (`DomicilioPersona`)
    REFERENCES `cocinasketapa1`.`DireccionPersona` (`DireccionPersonaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Cita`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Cita` (
  `CitaId` INT NOT NULL AUTO_INCREMENT,
  `TareaCitaId` INT NOT NULL,
  `PersonaId` INT NOT NULL,
  `EstatusCitaId` INT NOT NULL,
  `ColaboradorId` INT NULL,
  `UnidadNegocioId` INT NULL,
  `ProyectoId` INT NULL,
  `Asunto` VARCHAR(255) NOT NULL,
  `Fecha` DATE NOT NULL,
  `HoraInico` TIME(0) NOT NULL,
  `HoraFin` TIME(0) NOT NULL,
  `Descripcion` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`CitaId`),
  INDEX `AsuntoCitaId_idx` (`TareaCitaId` ASC),
  INDEX `EstatusCitaId_idx` (`EstatusCitaId` ASC),
  INDEX `PersonaIdCita_idx` (`PersonaId` ASC),
  INDEX `UnidadNegocioIdCita_idx` (`UnidadNegocioId` ASC),
  INDEX `ColaboradorIdCita_idx` (`ColaboradorId` ASC),
  INDEX `ProyectoIdCita_idx` (`ProyectoId` ASC),
  CONSTRAINT `PersonaIdCita`
    FOREIGN KEY (`PersonaId`)
    REFERENCES `cocinasketapa1`.`Persona` (`PersonaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `AsuntoCitaId`
    FOREIGN KEY (`TareaCitaId`)
    REFERENCES `cocinasketapa1`.`TareaCita` (`TareaCitaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `EstatusCitaId`
    FOREIGN KEY (`EstatusCitaId`)
    REFERENCES `cocinasketapa1`.`EstatusCita` (`EstatusCitaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `UnidadNegocioIdCita`
    FOREIGN KEY (`UnidadNegocioId`)
    REFERENCES `cocinasketapa1`.`UnidadNegocio` (`UnidadNegocioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ColaboradorIdCita`
    FOREIGN KEY (`ColaboradorId`)
    REFERENCES `cocinasketapa1`.`Colaborador` (`ColaboradorId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ProyectoIdCita`
    FOREIGN KEY (`ProyectoId`)
    REFERENCES `cocinasketapa1`.`Proyecto` (`ProyectoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ProyectoComentario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ProyectoComentario` (
  `ProyectoComentarioId` INT NOT NULL AUTO_INCREMENT,
  `ProyectoId` INT NOT NULL,
  `Comentario` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`ProyectoComentarioId`),
  INDEX `ProyectoId_idx` (`ProyectoId` ASC),
  CONSTRAINT `ProyectoComentario`
    FOREIGN KEY (`ProyectoId`)
    REFERENCES `cocinasketapa1`.`Proyecto` (`ProyectoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`CitaPorColaborador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`CitaPorColaborador` (
  `CitaPorColaboradorId` INT NOT NULL AUTO_INCREMENT,
  `CitaId` INT NOT NULL,
  `ColaboradorId` INT NOT NULL,
  PRIMARY KEY (`CitaPorColaboradorId`),
  INDEX `CitaId_idx` (`CitaId` ASC),
  INDEX `ColaboradorId_idx` (`ColaboradorId` ASC),
  CONSTRAINT `CitaColaborador`
    FOREIGN KEY (`CitaId`)
    REFERENCES `cocinasketapa1`.`Cita` (`CitaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ColaboradorCitaId`
    FOREIGN KEY (`ColaboradorId`)
    REFERENCES `cocinasketapa1`.`Colaborador` (`ColaboradorId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Contrato`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Contrato` (
  `ContratoId` INT NOT NULL AUTO_INCREMENT,
  `ProyectoId` INT NOT NULL,
  `PlanPagosId` INT NOT NULL,
  `UsuarioIdCancelacion` INT NULL,
  `Total` DECIMAL(2) NOT NULL,
  `IVA` DECIMAL(2) NOT NULL,
  `Subtotal` DECIMAL(2) NOT NULL,
  `FechaInicio` DATETIME NOT NULL,
  `FechaCompromiso` DATETIME NOT NULL,
  `FechaEntrega` DATETIME NOT NULL,
  `FechaCancelacion` DATETIME NULL,
  PRIMARY KEY (`ContratoId`),
  INDEX `ProyectoId_idx` (`ProyectoId` ASC),
  INDEX `PlanPagosId_idx` (`PlanPagosId` ASC),
  INDEX `UsuarioIdCancelacionContrato_idx` (`UsuarioIdCancelacion` ASC),
  CONSTRAINT `ProyectoContrato`
    FOREIGN KEY (`ProyectoId`)
    REFERENCES `cocinasketapa1`.`Proyecto` (`ProyectoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `PlanPagosContrato`
    FOREIGN KEY (`PlanPagosId`)
    REFERENCES `cocinasketapa1`.`PlanPago` (`PlanPagoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `UsuarioIdCancelacionContrato`
    FOREIGN KEY (`UsuarioIdCancelacion`)
    REFERENCES `cocinasketapa1`.`Usuario` (`UsuarioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`EstadoCuenta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`EstadoCuenta` (
  `EstadoCuentaId` INT NOT NULL AUTO_INCREMENT,
  `ContratoId` INT NOT NULL,
  `Importe` INT NOT NULL,
  `FechaCompromiso` DATETIME NOT NULL,
  `NumeroAbono` DECIMAL(2) NOT NULL,
  `Abono` DECIMAL(2) NOT NULL,
  `Pagado` TINYINT(1) NOT NULL,
  `Concepto` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`EstadoCuentaId`),
  INDEX `ContratoId_idx` (`ContratoId` ASC),
  CONSTRAINT `ContratoId`
    FOREIGN KEY (`ContratoId`)
    REFERENCES `cocinasketapa1`.`Contrato` (`ContratoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`CoceptoPago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`CoceptoPago` (
  `CoceptoPagoId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`CoceptoPagoId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Pago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Pago` (
  `PagoId` INT NOT NULL AUTO_INCREMENT,
  `EstadoCuentaId` INT NOT NULL,
  `UsuarioIdCancelacion` INT NULL,
  `UsuarioId` INT NOT NULL,
  `ConceptoPagoId` INT NOT NULL,
  `Pago` DECIMAL(2) NOT NULL,
  `Fecha` DATETIME NOT NULL,
  `FechaCancelado` DATETIME NULL,
  PRIMARY KEY (`PagoId`),
  INDEX `EstadoCuentaId_idx` (`EstadoCuentaId` ASC),
  INDEX `UsuarioId_idx` (`UsuarioId` ASC),
  INDEX `ConceptoPagoId_idx` (`ConceptoPagoId` ASC),
  INDEX `UsuarioCancelacion_idx` (`UsuarioIdCancelacion` ASC),
  CONSTRAINT `EstadoCuentaPago`
    FOREIGN KEY (`EstadoCuentaId`)
    REFERENCES `cocinasketapa1`.`EstadoCuenta` (`EstadoCuentaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `UsuarioPago`
    FOREIGN KEY (`UsuarioId`)
    REFERENCES `cocinasketapa1`.`Usuario` (`UsuarioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ConceptoPagoPago`
    FOREIGN KEY (`ConceptoPagoId`)
    REFERENCES `cocinasketapa1`.`CoceptoPago` (`CoceptoPagoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `CancelacionUsuarioPago`
    FOREIGN KEY (`UsuarioIdCancelacion`)
    REFERENCES `cocinasketapa1`.`Usuario` (`UsuarioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ClaseAccesorio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ClaseAccesorio` (
  `ClaseAccesorioId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`ClaseAccesorioId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoAccesorio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoAccesorio` (
  `TipoAccesorioId` INT NOT NULL AUTO_INCREMENT,
  `ClaseAccesorioId` INT NOT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  `Instrucciones` LONGBLOB NULL,
  `Activo` TINYINT(1) NOT NULL,
  `NombreArchivo` VARCHAR(250) NULL,
  PRIMARY KEY (`TipoAccesorioId`),
  INDEX `ClaseAccesorioIdTipo_idx` (`ClaseAccesorioId` ASC),
  CONSTRAINT `ClaseAccesorioIdTipo`
    FOREIGN KEY (`ClaseAccesorioId`)
    REFERENCES `cocinasketapa1`.`ClaseAccesorio` (`ClaseAccesorioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Muestrario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Muestrario` (
  `MuestrarioId` INT NOT NULL AUTO_INCREMENT,
  `TipoMuestrarioId` TINYINT(4) NOT NULL,
  `TipoAccesorioId` INT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  `Margen` DECIMAL(6,2) NULL,
  `Activo` TINYINT(4) NOT NULL,
  `PorDefecto` TINYINT(4) NOT NULL,
  PRIMARY KEY (`MuestrarioId`),
  UNIQUE INDEX `PorDefecto_UNIQUE` (`PorDefecto` ASC),
  UNIQUE INDEX `TipoMuestrarioId_UNIQUE` (`TipoMuestrarioId` ASC),
  INDEX `TipoAccesorioIdMuestrario_idx` (`TipoAccesorioId` ASC),
  CONSTRAINT `TipoAccesorioIdMuestrario`
    FOREIGN KEY (`TipoAccesorioId`)
    REFERENCES `cocinasketapa1`.`TipoAccesorio` (`TipoAccesorioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Accesorio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Accesorio` (
  `AccesorioId` INT NOT NULL AUTO_INCREMENT,
  `TipoAccesorioId` INT NOT NULL,
  `MuestrarioId` INT NOT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  `Imagen` LONGBLOB NULL,
  `CostoUnidad` DECIMAL(6,2) NULL,
  `ConsumoUnidad` DECIMAL(6,2) NULL,
  `Contable` TINYINT(1) NOT NULL,
  `Obligatorio` TINYINT(1) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`AccesorioId`),
  INDEX `TipoAccesorio_idx` (`TipoAccesorioId` ASC),
  INDEX `MuestrarioIdAccesorios_idx` (`MuestrarioId` ASC),
  CONSTRAINT `TipoAccesorio`
    FOREIGN KEY (`TipoAccesorioId`)
    REFERENCES `cocinasketapa1`.`TipoAccesorio` (`TipoAccesorioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `MuestrarioIdAccesorios`
    FOREIGN KEY (`MuestrarioId`)
    REFERENCES `cocinasketapa1`.`Muestrario` (`MuestrarioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`VentaPorAccesorio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`VentaPorAccesorio` (
  `VentaPorAccesorioIId` INT NOT NULL AUTO_INCREMENT,
  `AccesorioId` INT NOT NULL,
  `VentaId` INT NOT NULL,
  `Total` DECIMAL(2) NOT NULL,
  `IVA` DECIMAL(2) NOT NULL,
  `Subtotal` DECIMAL(2) NOT NULL,
  `Descuento` INT NOT NULL,
  PRIMARY KEY (`VentaPorAccesorioIId`),
  INDEX `VentaId_idx` (`VentaId` ASC),
  INDEX `AccesorioId_idx` (`AccesorioId` ASC),
  CONSTRAINT `VentaAccesorio`
    FOREIGN KEY (`VentaId`)
    REFERENCES `cocinasketapa1`.`Venta` (`VentaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `AccesorioVenta`
    FOREIGN KEY (`AccesorioId`)
    REFERENCES `cocinasketapa1`.`Accesorio` (`AccesorioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ContactoProveedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ContactoProveedor` (
  `ContactoProveedorId` INT NOT NULL,
  `ProveedorId` INT NOT NULL,
  `TipoMedioContactoId` INT NOT NULL,
  `Contacto` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`ContactoProveedorId`),
  INDEX `ProveedorContacto_idx` (`ProveedorId` ASC),
  INDEX `TipoMedioContacto_idx` (`TipoMedioContactoId` ASC),
  CONSTRAINT `ProveedorContacto`
    FOREIGN KEY (`ProveedorId`)
    REFERENCES `cocinasketapa1`.`Proveedor` (`ProveedorId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `TipoMedioProveedor`
    FOREIGN KEY (`TipoMedioContactoId`)
    REFERENCES `cocinasketapa1`.`TipoMedioContacto` (`TipoMedioContactoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`CodigoPostal`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`CodigoPostal` (
  `CodigoPostalId` INT NOT NULL AUTO_INCREMENT,
  `Codigo` VARCHAR(5) NOT NULL,
  `Colonia` VARCHAR(80) NOT NULL,
  `Municipio` VARCHAR(80) NOT NULL,
  `Ciudad` VARCHAR(80) NOT NULL,
  `Estado` VARCHAR(50) NOT NULL,
  `ClaveEstado` VARCHAR(5) NOT NULL,
  PRIMARY KEY (`CodigoPostalId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ColorPorTipoProducto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ColorPorTipoProducto` (
  `ColorPorTipoProductoId` INT NOT NULL AUTO_INCREMENT,
  `ColorId` INT NOT NULL,
  `ProductoId` INT NOT NULL,
  PRIMARY KEY (`ColorPorTipoProductoId`),
  INDEX `ColorIdTipoProducto_idx` (`ColorId` ASC),
  INDEX `ProductoIdColor_idx` (`ProductoId` ASC),
  CONSTRAINT `ColorIdTipoProducto`
    FOREIGN KEY (`ColorId`)
    REFERENCES `cocinasketapa1`.`Color` (`ColorId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ProductoIdColor`
    FOREIGN KEY (`ProductoId`)
    REFERENCES `cocinasketapa1`.`Producto` (`ProductoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`FormaPagoPorPago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`FormaPagoPorPago` (
  `FormaPagoPorPagoId` INT NOT NULL AUTO_INCREMENT,
  `PagoId` INT NOT NULL,
  `FomaPagoId` INT NOT NULL,
  `CuentaId` INT NULL,
  `Importe` DECIMAL(2) NOT NULL,
  PRIMARY KEY (`FormaPagoPorPagoId`),
  INDEX `PagoPorFormaPago_idx` (`PagoId` ASC),
  INDEX `CuentaPorFormaPago_idx` (`CuentaId` ASC),
  INDEX `FormaPagoPorPago_idx` (`FomaPagoId` ASC),
  CONSTRAINT `PagoPorFormaPago`
    FOREIGN KEY (`PagoId`)
    REFERENCES `cocinasketapa1`.`Pago` (`PagoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `CuentaPorFormaPago`
    FOREIGN KEY (`CuentaId`)
    REFERENCES `cocinasketapa1`.`Cuenta` (`CuentaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FormaPagoPorPago`
    FOREIGN KEY (`FomaPagoId`)
    REFERENCES `cocinasketapa1`.`FormaPago` (`FormaPagoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`FormaPagoPorVenta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`FormaPagoPorVenta` (
  `FormaPagoPorVentaId` INT NOT NULL AUTO_INCREMENT,
  `FormaPagoId` INT NOT NULL,
  `CuentaId` INT NULL,
  `VentaId` INT NOT NULL,
  `Importe` DECIMAL(2) NOT NULL,
  PRIMARY KEY (`FormaPagoPorVentaId`),
  INDEX `CuentaIdPagoVenta_idx` (`CuentaId` ASC),
  INDEX `VentaFormaPago_idx` (`VentaId` ASC),
  INDEX `FormaPagoVenta_idx` (`FormaPagoId` ASC),
  CONSTRAINT `CuentaIdPagoVenta`
    FOREIGN KEY (`CuentaId`)
    REFERENCES `cocinasketapa1`.`Cuenta` (`CuentaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `VentaFormaPago`
    FOREIGN KEY (`VentaId`)
    REFERENCES `cocinasketapa1`.`Venta` (`VentaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FormaPagoVenta`
    FOREIGN KEY (`FormaPagoId`)
    REFERENCES `cocinasketapa1`.`FormaPago` (`FormaPagoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`MuestrarioPorAccesorio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`MuestrarioPorAccesorio` (
  `MuestrarioPorAccesorioId` INT NOT NULL AUTO_INCREMENT,
  `AccesorioId` INT NOT NULL,
  `MuestrarioId` INT NOT NULL,
  PRIMARY KEY (`MuestrarioPorAccesorioId`),
  INDEX `MuestrarioIdAccesorio_idx` (`MuestrarioId` ASC),
  INDEX `AccesorioIdMuestrario_idx` (`AccesorioId` ASC),
  UNIQUE INDEX `AccesorioId_UNIQUE` (`AccesorioId` ASC),
  CONSTRAINT `AccesorioIdMuestrario`
    FOREIGN KEY (`AccesorioId`)
    REFERENCES `cocinasketapa1`.`Accesorio` (`AccesorioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `MuestrarioIdAccesorio`
    FOREIGN KEY (`MuestrarioId`)
    REFERENCES `cocinasketapa1`.`Muestrario` (`MuestrarioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`AccesorioPorProveedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`AccesorioPorProveedor` (
  `AccesorioPorProveedorId` INT NOT NULL AUTO_INCREMENT,
  `ProveedorId` INT NOT NULL,
  `AccesorioId` INT NOT NULL,
  PRIMARY KEY (`AccesorioPorProveedorId`),
  INDEX `AccesorioProveedor_idx` (`AccesorioId` ASC),
  INDEX `ProveedorAccesorio_idx` (`ProveedorId` ASC),
  CONSTRAINT `AccesorioProveedor`
    FOREIGN KEY (`AccesorioId`)
    REFERENCES `cocinasketapa1`.`Accesorio` (`AccesorioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ProveedorAccesorio`
    FOREIGN KEY (`ProveedorId`)
    REFERENCES `cocinasketapa1`.`Proveedor` (`ProveedorId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoPromocion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoPromocion` (
  `TipoPromocionId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`TipoPromocionId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoVenta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoVenta` (
  `TipoVentaId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`TipoVentaId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Promocion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Promocion` (
  `PromocionId` INT NOT NULL AUTO_INCREMENT,
  `TipoPromocionId` INT NOT NULL,
  `TipoVentaId` INT NOT NULL,
  `Descripcion` VARCHAR(255) NOT NULL,
  `DescuentoMinimo` INT NOT NULL,
  `DescuentoMaximo` INT NOT NULL,
  `NumeroPagos` VARCHAR(45) NOT NULL,
  `FechaLimite` DATE NULL,
  `Vigencia` INT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`PromocionId`),
  INDEX `TipoPromocionID` (`TipoPromocionId` ASC),
  INDEX `TipoVentaId` (`TipoVentaId` ASC),
  CONSTRAINT `TipoPromocionId`
    FOREIGN KEY (`TipoPromocionId`)
    REFERENCES `cocinasketapa1`.`TipoPromocion` (`TipoPromocionId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `TipoVentaId`
    FOREIGN KEY (`TipoVentaId`)
    REFERENCES `cocinasketapa1`.`TipoVenta` (`TipoVentaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`DatosFiscales`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`DatosFiscales` (
  `DatosFiscalesId` INT NOT NULL AUTO_INCREMENT,
  `PersonaId` INT NOT NULL,
  `DireccionPersonaId` INT NOT NULL,
  `CorreoElectronicoId` INT NOT NULL,
  `RFC` VARCHAR(15) NOT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`DatosFiscalesId`),
  INDEX `ClienteIdFiscales_idx` (`PersonaId` ASC),
  INDEX `DireccionClienteIdFiscal_idx` (`DireccionPersonaId` ASC),
  INDEX `emailIdFiscak_idx` (`CorreoElectronicoId` ASC),
  CONSTRAINT `ClienteIdFiscales`
    FOREIGN KEY (`PersonaId`)
    REFERENCES `cocinasketapa1`.`Persona` (`PersonaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `DireccionClienteIdFiscal`
    FOREIGN KEY (`DireccionPersonaId`)
    REFERENCES `cocinasketapa1`.`DireccionPersona` (`DireccionPersonaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `emailIdFiscak`
    FOREIGN KEY (`CorreoElectronicoId`)
    REFERENCES `cocinasketapa1`.`ContactoPersona` (`ContactoPersonaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`PromocionPorUnidadNegocio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`PromocionPorUnidadNegocio` (
  `PromocionPorUnidadNegocioId` INT NOT NULL AUTO_INCREMENT,
  `PromocionId` INT NOT NULL,
  `UnidadNegocioId` INT NOT NULL,
  PRIMARY KEY (`PromocionPorUnidadNegocioId`),
  INDEX `PromocionPorUnidadNegocio_idx` (`PromocionId` ASC),
  INDEX `UnidadNegocioIdPorDescuento_idx` (`UnidadNegocioId` ASC),
  CONSTRAINT `PromocionPorUnidadNegocio`
    FOREIGN KEY (`PromocionId`)
    REFERENCES `cocinasketapa1`.`Promocion` (`PromocionId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `UnidadNegocioIdPorPromocion`
    FOREIGN KEY (`UnidadNegocioId`)
    REFERENCES `cocinasketapa1`.`UnidadNegocio` (`UnidadNegocioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoModulo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoModulo` (
  `TipoModuloId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`TipoModuloId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Modulo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Modulo` (
  `ModuloId` INT NOT NULL AUTO_INCREMENT,
  `TipoModuloId` INT NOT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  `Margen` DECIMAL(6,2) NOT NULL,
  `Imagen` BLOB NOT NULL,
  `NumeroSeccion` TINYINT(4) NOT NULL,
  `Desperdicio` DECIMAL(6,2) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`ModuloId`),
  INDEX `TipoModuloId_idx` (`TipoModuloId` ASC),
  CONSTRAINT `TipoModuloId`
    FOREIGN KEY (`TipoModuloId`)
    REFERENCES `cocinasketapa1`.`TipoModulo` (`TipoModuloId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`MedidasPorModulo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`MedidasPorModulo` (
  `MedidasPorModuloId` INT NOT NULL AUTO_INCREMENT,
  `ModuloId` INT NOT NULL,
  `Ancho` VARCHAR(10) NOT NULL,
  `Alto` VARCHAR(10) NOT NULL,
  `Profundo` VARCHAR(10) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`MedidasPorModuloId`),
  INDEX `ModuloIdMedidas_idx` (`ModuloId` ASC),
  CONSTRAINT `ModuloIdMedidas`
    FOREIGN KEY (`ModuloId`)
    REFERENCES `cocinasketapa1`.`Modulo` (`ModuloId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoComponente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoComponente` (
  `TipoComponenteId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`TipoComponenteId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Componente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Componente` (
  `ComponenteId` INT NOT NULL AUTO_INCREMENT,
  `TipoComponenteId` INT NOT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`ComponenteId`),
  INDEX `TipoComponenteId_idx` (`TipoComponenteId` ASC),
  CONSTRAINT `TipoComponenteId`
    FOREIGN KEY (`TipoComponenteId`)
    REFERENCES `cocinasketapa1`.`TipoComponente` (`TipoComponenteId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ComponentePorModulo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ComponentePorModulo` (
  `ComponentePorModuloId` INT NOT NULL AUTO_INCREMENT,
  `ComponenteId` INT NOT NULL,
  `ModuloId` INT NOT NULL,
  `Cantidad` INT NOT NULL,
  PRIMARY KEY (`ComponentePorModuloId`),
  INDEX `ComponenteModulo_idx` (`ComponenteId` ASC),
  INDEX `ModuloComponente_idx` (`ModuloId` ASC),
  CONSTRAINT `ComponenteModulo`
    FOREIGN KEY (`ComponenteId`)
    REFERENCES `cocinasketapa1`.`Componente` (`ComponenteId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ModuloComponente`
    FOREIGN KEY (`ModuloId`)
    REFERENCES `cocinasketapa1`.`Modulo` (`ModuloId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Pieza`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Pieza` (
  `PiezaId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  `FormulaAncho` VARCHAR(250) NOT NULL,
  `FormulaLargo` VARCHAR(250) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`PiezaId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoMaterial`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoMaterial` (
  `TipoMaterialId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  `DisponibleCubierta` TINYINT(1) NOT NULL,
  `DisponibleModulo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`TipoMaterialId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`PiezaPorComponente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`PiezaPorComponente` (
  `PiezaPorComponenteId` INT NOT NULL AUTO_INCREMENT,
  `PiezaId` INT NOT NULL,
  `ComponenteId` INT NOT NULL,
  `Cantidad` INT NOT NULL,
  PRIMARY KEY (`PiezaPorComponenteId`),
  INDEX `PiezaComponente_idx` (`PiezaId` ASC),
  INDEX `ComponentePieza_idx` (`ComponenteId` ASC),
  CONSTRAINT `PiezaComponente`
    FOREIGN KEY (`PiezaId`)
    REFERENCES `cocinasketapa1`.`Pieza` (`PiezaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ComponentePieza`
    FOREIGN KEY (`ComponenteId`)
    REFERENCES `cocinasketapa1`.`Componente` (`ComponenteId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`SeccionModulo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`SeccionModulo` (
  `SeccionModuloId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`SeccionModuloId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Puerta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Puerta` (
  `PuertaId` INT NOT NULL AUTO_INCREMENT,
  `MuestrarioId` INT NOT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`PuertaId`),
  INDEX `MuestrarioFrenteIdEstilo_idx` (`MuestrarioId` ASC),
  CONSTRAINT `MuestrarioFrenteIdEstilo`
    FOREIGN KEY (`MuestrarioId`)
    REFERENCES `cocinasketapa1`.`Muestrario` (`MuestrarioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`MaterialOtroComponente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`MaterialOtroComponente` (
  `MaterialOtroComponenteId` INT NOT NULL AUTO_INCREMENT,
  `CombinacionMaterialId` INT NOT NULL,
  `OtroComponenteId` INT NOT NULL,
  `MaterialId` INT NOT NULL,
  `Grueso` FLOAT NOT NULL,
  PRIMARY KEY (`MaterialOtroComponenteId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`PiezaPorComponentePuerta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`PiezaPorComponentePuerta` (
  `PiezaPorComponentePuertaId` INT NOT NULL AUTO_INCREMENT,
  `PiezaId` INT NOT NULL,
  `ComponentePorPuertaId` INT NOT NULL,
  `Cantidad` TINYINT NOT NULL,
  PRIMARY KEY (`PiezaPorComponentePuertaId`),
  INDEX `PiezaIdComponentePuerta_idx` (`PiezaId` ASC),
  INDEX `ComponentePorPuertaId_idx` (`ComponentePorPuertaId` ASC),
  CONSTRAINT `PiezaIdComponentePuerta`
    FOREIGN KEY (`PiezaId`)
    REFERENCES `cocinasketapa1`.`Pieza` (`PiezaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ComponentePorPuertaId`
    FOREIGN KEY (`ComponentePorPuertaId`)
    REFERENCES `cocinasketapa1`.`ComponentePorPuerta` (`ComponentePorPuertaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ComponentePorPuerta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ComponentePorPuerta` (
  `ComponentePorPuertaId` INT NOT NULL AUTO_INCREMENT,
  `PuertaId` INT NOT NULL,
  `ComponenteId` INT NOT NULL,
  PRIMARY KEY (`ComponentePorPuertaId`),
  INDEX `PuertaIdPorComponente_idx` (`PuertaId` ASC),
  INDEX `ComponenteIdPuerta_idx` (`ComponenteId` ASC),
  CONSTRAINT `PuertaIdPorComponente`
    FOREIGN KEY (`PuertaId`)
    REFERENCES `cocinasketapa1`.`Puerta` (`PuertaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ComponenteIdPuerta`
    FOREIGN KEY (`ComponenteId`)
    REFERENCES `cocinasketapa1`.`Componente` (`ComponenteId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Ubicacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Ubicacion` (
  `UbicacionId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`UbicacionId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Material`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Material` (
  `MaterialId` INT NOT NULL AUTO_INCREMENT,
  `TipoMaterialId` INT NOT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  `CostoUnidad` DECIMAL(6,2) NOT NULL,
  `MaterialDe` VARCHAR(120) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`MaterialId`),
  INDEX `TipoMaterialIdMaterial_idx` (`TipoMaterialId` ASC),
  CONSTRAINT `TipoMaterialIdMaterial`
    FOREIGN KEY (`TipoMaterialId`)
    REFERENCES `cocinasketapa1`.`TipoMaterial` (`TipoMaterialId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoCombinacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoCombinacion` (
  `TipoCombinacionId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  `Descripcion` VARCHAR(1000) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`TipoCombinacionId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`CombinacionMaterial`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`CombinacionMaterial` (
  `CombinacionMaterialId` INT NOT NULL AUTO_INCREMENT,
  `TipoCombinacionId` INT NOT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  `Descripcion` VARCHAR(1000) NOT NULL,
  `PorDefecto` TINYINT(1) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`CombinacionMaterialId`),
  INDEX `TipoCombinacionId_idx` (`TipoCombinacionId` ASC),
  CONSTRAINT `TipoCombinacionIdCombinacion`
    FOREIGN KEY (`TipoCombinacionId`)
    REFERENCES `cocinasketapa1`.`TipoCombinacion` (`TipoCombinacionId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`CombinacionPorMaterialComponente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`CombinacionPorMaterialComponente` (
  `CombinacionPorMaterialComponenteId` INT NOT NULL AUTO_INCREMENT,
  `ComponenteId` INT NULL,
  `ComponentePorPuertaId` INT NULL,
  `CombinacionMaterialId` INT NOT NULL,
  `MaterialId` INT NOT NULL,
  `Grueso` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`CombinacionPorMaterialComponenteId`),
  INDEX `ComponetePorMaterial_idx` (`ComponenteId` ASC),
  INDEX `MaterialIdPorComponenteCombinacion_idx` (`MaterialId` ASC),
  INDEX `CimbinacionMaterialIdPorComponente_idx` (`CombinacionMaterialId` ASC),
  INDEX `CombinacionMaterialComponentePuerta_idx` (`ComponentePorPuertaId` ASC),
  CONSTRAINT `ComponetePorMaterial`
    FOREIGN KEY (`ComponenteId`)
    REFERENCES `cocinasketapa1`.`Componente` (`ComponenteId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `MaterialIdPorComponenteCombinacion`
    FOREIGN KEY (`MaterialId`)
    REFERENCES `cocinasketapa1`.`Material` (`MaterialId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `CimbinacionMaterialIdPorComponente`
    FOREIGN KEY (`CombinacionMaterialId`)
    REFERENCES `cocinasketapa1`.`CombinacionMaterial` (`CombinacionMaterialId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `CombinacionMaterialComponentePuerta`
    FOREIGN KEY (`ComponentePorPuertaId`)
    REFERENCES `cocinasketapa1`.`ComponentePorPuerta` (`ComponentePorPuertaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`SeccionPorModulo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`SeccionPorModulo` (
  `SeccionPorModuloId` INT NOT NULL AUTO_INCREMENT,
  `SeccionModuloId` INT NOT NULL,
  `ModuloId` INT NOT NULL,
  `NumeroPiezas` TINYINT(4) NOT NULL,
  `PeinazoVertical` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`SeccionPorModuloId`),
  INDEX `ModuloIdLuz_idx` (`ModuloId` ASC),
  INDEX `SeccionModuloIdLuz_idx` (`SeccionModuloId` ASC),
  CONSTRAINT `ModuloIdLuz`
    FOREIGN KEY (`ModuloId`)
    REFERENCES `cocinasketapa1`.`Modulo` (`ModuloId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `SeccionModuloIdLuz`
    FOREIGN KEY (`SeccionModuloId`)
    REFERENCES `cocinasketapa1`.`SeccionModulo` (`SeccionModuloId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoParte`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoParte` (
  `TipoParteId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`TipoParteId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`PartePorModulo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`PartePorModulo` (
  `PartePorModuloId` INT NOT NULL AUTO_INCREMENT,
  `ModuloId` INT NOT NULL,
  `TipoParteId` INT NOT NULL,
  `Ancho` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`PartePorModuloId`),
  INDEX `ModuloIdPeinazo_idx` (`ModuloId` ASC),
  INDEX `TipoParteId_idx` (`TipoParteId` ASC),
  CONSTRAINT `ModuloIdPeinazo`
    FOREIGN KEY (`ModuloId`)
    REFERENCES `cocinasketapa1`.`Modulo` (`ModuloId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `TipoParteId`
    FOREIGN KEY (`TipoParteId`)
    REFERENCES `cocinasketapa1`.`TipoParte` (`TipoParteId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`MuestrarioPuerta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`MuestrarioPuerta` (
  `Muestrario` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(45) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`Muestrario`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Consumible`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Consumible` (
  `ConsumibleId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  `Costo` DECIMAL(6,2) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`ConsumibleId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ConsumiblePorModulo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ConsumiblePorModulo` (
  `ConsumiblePorModuloId` INT NOT NULL AUTO_INCREMENT,
  `ModuloId` INT NOT NULL,
  `ConsumibleId` INT NOT NULL,
  `Cantidad` TINYINT(4) NOT NULL,
  PRIMARY KEY (`ConsumiblePorModuloId`),
  INDEX `ModuloIdPorConsumible_idx` (`ModuloId` ASC),
  INDEX `ConsumibleId_idx` (`ConsumibleId` ASC),
  CONSTRAINT `ModuloIdPorConsumible`
    FOREIGN KEY (`ModuloId`)
    REFERENCES `cocinasketapa1`.`Modulo` (`ModuloId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ConsumibleId`
    FOREIGN KEY (`ConsumibleId`)
    REFERENCES `cocinasketapa1`.`Consumible` (`ConsumibleId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`LuzPorSeccion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`LuzPorSeccion` (
  `LuzPorSeccionId` INT NOT NULL AUTO_INCREMENT,
  `SeccionPorModuloId` INT NOT NULL,
  `Luz` VARCHAR(10) NOT NULL,
  `NumeroEntrepano` TINYINT(4) NOT NULL,
  `AltoModulo` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`LuzPorSeccionId`),
  INDEX `SeccionPorModuloIdLuz_idx` (`SeccionPorModuloId` ASC),
  CONSTRAINT `SeccionPorModuloIdLuz`
    FOREIGN KEY (`SeccionPorModuloId`)
    REFERENCES `cocinasketapa1`.`SeccionPorModulo` (`SeccionPorModuloId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`GruesoMaterial`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`GruesoMaterial` (
  `GruesoMaterialId` INT NOT NULL AUTO_INCREMENT,
  `MaterialId` INT NOT NULL,
  `Grueso` VARCHAR(10) NOT NULL,
  `CostoUnidad` DECIMAL(6,2) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`GruesoMaterialId`),
  INDEX `MaterialIdGrueso_idx` (`MaterialId` ASC),
  CONSTRAINT `MaterialIdGrueso`
    FOREIGN KEY (`MaterialId`)
    REFERENCES `cocinasketapa1`.`Material` (`MaterialId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ComponentePuerta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ComponentePuerta` (
  `ComponentePuertaId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`ComponentePuertaId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`PiezaPorComponentePuerta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`PiezaPorComponentePuerta` (
  `PiezaPorComponentePuertaId` INT NOT NULL AUTO_INCREMENT,
  `PiezaId` INT NOT NULL,
  `ComponentePorPuertaId` INT NOT NULL,
  `Cantidad` TINYINT NOT NULL,
  PRIMARY KEY (`PiezaPorComponentePuertaId`),
  INDEX `PiezaIdComponentePuerta_idx` (`PiezaId` ASC),
  INDEX `ComponentePorPuertaId_idx` (`ComponentePorPuertaId` ASC),
  CONSTRAINT `PiezaIdComponentePuerta`
    FOREIGN KEY (`PiezaId`)
    REFERENCES `cocinasketapa1`.`Pieza` (`PiezaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ComponentePorPuertaId`
    FOREIGN KEY (`ComponentePorPuertaId`)
    REFERENCES `cocinasketapa1`.`ComponentePorPuerta` (`ComponentePorPuertaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`MaterialPara`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`MaterialPara` (
  `MaterialParaId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`MaterialParaId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoMuestrario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoMuestrario` (
  `TipoMuestrarioId` TINYINT(4) NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`TipoMuestrarioId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Bug`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Bug` (
  `BugId` INT NOT NULL AUTO_INCREMENT,
  `UsuarioId` INT NOT NULL,
  `Modulo` VARCHAR(250) NOT NULL,
  `Seccion` VARCHAR(250) NOT NULL,
  `Descripcion` VARCHAR(1000) NOT NULL,
  `Operacion` VARCHAR(120) NOT NULL,
  `Fecha` DATETIME NOT NULL,
  `Resuelto` TINYINT(4) NOT NULL,
  `FechaResuelto` DATETIME NULL,
  `Observacion` VARCHAR(250) NULL,
  PRIMARY KEY (`BugId`),
  INDEX `UsuarioIdReporteBug_idx` (`UsuarioId` ASC),
  CONSTRAINT `UsuarioIdReporteBug`
    FOREIGN KEY (`UsuarioId`)
    REFERENCES `cocinasketapa1`.`Usuario` (`UsuarioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`SolicitudRecuperarPassword`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`SolicitudRecuperarPassword` (
  `SolicitudRecuperarPasswordId` INT NOT NULL AUTO_INCREMENT,
  `UsuarioId` INT NOT NULL,
  `Codigo` VARCHAR(10) NOT NULL,
  `Fecha` DATETIME NOT NULL,
  `FechaCaducidad` DATETIME NOT NULL,
  `Estatus` VARCHAR(120) NULL,
  PRIMARY KEY (`SolicitudRecuperarPasswordId`),
  INDEX `UsuarioIdRecuperarPassword_idx` (`UsuarioId` ASC),
  CONSTRAINT `UsuarioIdRecuperarPassword`
    FOREIGN KEY (`UsuarioId`)
    REFERENCES `cocinasketapa1`.`Usuario` (`UsuarioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`UbicacionCubierta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`UbicacionCubierta` (
  `UbicacionCubiertaId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`UbicacionCubiertaId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoGrupo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoGrupo` (
  `TipoGrupoId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`TipoGrupoId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Grupo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Grupo` (
  `GrupoId` INT NOT NULL AUTO_INCREMENT,
  `TipoGrupoId` INT NOT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`GrupoId`),
  INDEX `TipopGrupoId_idx` (`TipoGrupoId` ASC),
  CONSTRAINT `TipopGrupoId`
    FOREIGN KEY (`TipoGrupoId`)
    REFERENCES `cocinasketapa1`.`TipoGrupo` (`TipoGrupoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`GrupoPorColor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`GrupoPorColor` (
  `GrupoPorColorId` INT NOT NULL AUTO_INCREMENT,
  `GrupoId` INT NOT NULL,
  `ColorId` INT NOT NULL,
  PRIMARY KEY (`GrupoPorColorId`),
  INDEX `ColorPorCubiertaId_idx` (`ColorId` ASC),
  INDEX `GrupoIdPorColor_idx` (`GrupoId` ASC),
  CONSTRAINT `ColorPorCubiertaId`
    FOREIGN KEY (`ColorId`)
    REFERENCES `cocinasketapa1`.`Color` (`ColorId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `GrupoIdPorColor`
    FOREIGN KEY (`GrupoId`)
    REFERENCES `cocinasketapa1`.`Grupo` (`GrupoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ColorPorMaterialCubierta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ColorPorMaterialCubierta` (
  `ColorPorMaterialCubiertaId` INT NOT NULL AUTO_INCREMENT,
  `GrupoId` INT NOT NULL,
  `MaterialId` INT NOT NULL,
  `CostoUnidad` DECIMAL(7,2) NOT NULL,
  `PorDefecto` TINYINT(1) NOT NULL,
  PRIMARY KEY (`ColorPorMaterialCubiertaId`),
  INDEX `MaterialPorColorCubiertaId_idx` (`MaterialId` ASC),
  INDEX `GrupoPorCubierta_idx` (`GrupoId` ASC),
  CONSTRAINT `MaterialPorColorCubiertaId`
    FOREIGN KEY (`MaterialId`)
    REFERENCES `cocinasketapa1`.`Material` (`MaterialId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `GrupoPorCubierta`
    FOREIGN KEY (`GrupoId`)
    REFERENCES `cocinasketapa1`.`Grupo` (`GrupoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`FabricacionCubierta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`FabricacionCubierta` (
  `FabricacionCubiertaId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`FabricacionCubiertaId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ConsumiblePorFabricacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ConsumiblePorFabricacion` (
  `ConsumiblePorFabricacionId` INT NOT NULL AUTO_INCREMENT,
  `ConsumibleId` INT NOT NULL,
  `FabricacionCubiertaId` INT NOT NULL,
  `Cantidad` TINYINT NOT NULL,
  PRIMARY KEY (`ConsumiblePorFabricacionId`),
  INDEX `FabricacionPorConsumible_idx` (`FabricacionCubiertaId` ASC),
  INDEX `ConcumibleCubiertaId_idx` (`ConsumibleId` ASC),
  CONSTRAINT `ConcumibleCubiertaId`
    FOREIGN KEY (`ConsumibleId`)
    REFERENCES `cocinasketapa1`.`Consumible` (`ConsumibleId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FabricacionPorConsumible`
    FOREIGN KEY (`FabricacionCubiertaId`)
    REFERENCES `cocinasketapa1`.`FabricacionCubierta` (`FabricacionCubiertaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoCubierta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoCubierta` (
  `TipoCubiertaId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`TipoCubiertaId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`DatosCubierta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`DatosCubierta` (
  `DatosCubiertaId` INT NOT NULL AUTO_INCREMENT,
  `MaterialId` INT NOT NULL,
  `TipoCubiertaId` INT NOT NULL,
  `Margen` DECIMAL(5,2) NOT NULL,
  `Desperdicio` DECIMAL(5,2) NOT NULL,
  PRIMARY KEY (`DatosCubiertaId`),
  INDEX `TipoCubiertaPorMaterial_idx` (`TipoCubiertaId` ASC),
  INDEX `MaterialIdPorCubierta_idx` (`MaterialId` ASC),
  CONSTRAINT `MaterialIdPorCubierta`
    FOREIGN KEY (`MaterialId`)
    REFERENCES `cocinasketapa1`.`Material` (`MaterialId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `TipoCubiertaPorMaterial`
    FOREIGN KEY (`TipoCubiertaId`)
    REFERENCES `cocinasketapa1`.`TipoCubierta` (`TipoCubiertaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`MaterialPorUbicacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`MaterialPorUbicacion` (
  `MaterialPorUbicacionId` INT NOT NULL AUTO_INCREMENT,
  `MaterialId` INT NOT NULL,
  `UbicacionCubiertaId` INT NOT NULL,
  PRIMARY KEY (`MaterialPorUbicacionId`),
  INDEX `MaterialIdPorUbicacion_idx` (`MaterialId` ASC),
  INDEX `UbicacionCubiertaIdMaterial_idx` (`UbicacionCubiertaId` ASC),
  CONSTRAINT `MaterialIdPorUbicacion`
    FOREIGN KEY (`MaterialId`)
    REFERENCES `cocinasketapa1`.`Material` (`MaterialId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `UbicacionCubiertaIdMaterial`
    FOREIGN KEY (`UbicacionCubiertaId`)
    REFERENCES `cocinasketapa1`.`UbicacionCubierta` (`UbicacionCubiertaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`FabricacionPorUbicacionTipoCubierta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`FabricacionPorUbicacionTipoCubierta` (
  `FabricacionPorUbicacionTipoCubierta` INT NOT NULL AUTO_INCREMENT,
  `UbicacionCubiertaId` INT NOT NULL,
  `FabricacionCubiertaId` INT NOT NULL,
  `TipoCubiertaId` INT NOT NULL,
  PRIMARY KEY (`FabricacionPorUbicacionTipoCubierta`),
  INDEX `FabricacionPorUbicacion_idx` (`FabricacionCubiertaId` ASC),
  INDEX `UbicacionPorFabricacion_idx` (`UbicacionCubiertaId` ASC),
  INDEX `TipoCubiertaPorFabricacion_idx` (`TipoCubiertaId` ASC),
  CONSTRAINT `UbicacionPorFabricacion`
    FOREIGN KEY (`UbicacionCubiertaId`)
    REFERENCES `cocinasketapa1`.`UbicacionCubierta` (`UbicacionCubiertaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FabricacionPorUbicacion`
    FOREIGN KEY (`FabricacionCubiertaId`)
    REFERENCES `cocinasketapa1`.`FabricacionCubierta` (`FabricacionCubiertaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `TipoCubiertaPorFabricacion`
    FOREIGN KEY (`TipoCubiertaId`)
    REFERENCES `cocinasketapa1`.`TipoCubierta` (`TipoCubiertaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`TipoMaterialPorTipoCubierta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`TipoMaterialPorTipoCubierta` (
  `TipoMaterialPorTipoCubiertaId` INT NOT NULL AUTO_INCREMENT,
  `TipoCubiertaId` INT NOT NULL,
  `TipoMaterialId` INT NOT NULL,
  PRIMARY KEY (`TipoMaterialPorTipoCubiertaId`),
  INDEX `TipoCubiertaPorTipoMaterial_idx` (`TipoCubiertaId` ASC),
  INDEX `TipoMaterialPorTipoCubierta_idx` (`TipoMaterialId` ASC),
  CONSTRAINT `TipoMaterialPorTipoCubierta`
    FOREIGN KEY (`TipoMaterialId`)
    REFERENCES `cocinasketapa1`.`TipoMaterial` (`TipoMaterialId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `TipoCubiertaPorTipoMaterial`
    FOREIGN KEY (`TipoCubiertaId`)
    REFERENCES `cocinasketapa1`.`TipoCubierta` (`TipoCubiertaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Maqueo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Maqueo` (
  `MaqueoId` INT NOT NULL AUTO_INCREMENT,
  `GrupoId` INT NOT NULL,
  `Nombre` VARCHAR(120) NOT NULL,
  `CostoUnidad` DECIMAL(6,2) NOT NULL,
  `PrecioVenta` DECIMAL(6,2) NOT NULL,
  `PorDefecto` TINYINT(1) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`MaqueoId`),
  INDEX `GrupoColorMaqueo_idx` (`GrupoId` ASC),
  CONSTRAINT `GrupoColorMaqueo`
    FOREIGN KEY (`GrupoId`)
    REFERENCES `cocinasketapa1`.`Grupo` (`GrupoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`CombinacionPorMaterialAccesorio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`CombinacionPorMaterialAccesorio` (
  `CombinacionPorMaterialAccesorioId` INT NOT NULL AUTO_INCREMENT,
  `CombinacionMaterialId` INT NOT NULL,
  `AccesorioId` INT NOT NULL,
  `MaterialId` INT NOT NULL,
  `Grueso` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`CombinacionPorMaterialAccesorioId`),
  INDEX `CombinacionMaterialIdAccesorio_idx` (`CombinacionMaterialId` ASC),
  INDEX `AccesorioIdCombinacion_idx` (`AccesorioId` ASC),
  INDEX `MaterialIdCombinacionAccesorio_idx` (`MaterialId` ASC),
  CONSTRAINT `CombinacionMaterialIdAccesorio`
    FOREIGN KEY (`CombinacionMaterialId`)
    REFERENCES `cocinasketapa1`.`CombinacionMaterial` (`CombinacionMaterialId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `AccesorioIdCombinacion`
    FOREIGN KEY (`AccesorioId`)
    REFERENCES `cocinasketapa1`.`Accesorio` (`AccesorioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `MaterialIdCombinacionAccesorio`
    FOREIGN KEY (`MaterialId`)
    REFERENCES `cocinasketapa1`.`Material` (`MaterialId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`VariableSistema`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`VariableSistema` (
  `VariableSistemaId` INT NOT NULL AUTO_INCREMENT,
  `Nomnbre` VARCHAR(120) NOT NULL,
  `Valor` DECIMAL(6,2) NOT NULL,
  PRIMARY KEY (`VariableSistemaId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Servicio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Servicio` (
  `ServicioId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  `CostoUnidad` DECIMAL(6,2) NOT NULL,
  `PrecioVenta` DECIMAL(6,2) NOT NULL,
  `Obligatorio` TINYINT(1) NOT NULL,
  `Activo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`ServicioId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ContactoAdicional`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ContactoAdicional` (
  `ContactoAdicionalId` INT NOT NULL AUTO_INCREMENT,
  `PersonaId` INT NOT NULL,
  `Nombre` VARCHAR(255) NOT NULL,
  `Telefono` VARCHAR(14) NULL,
  `CorreoElectronico` VARCHAR(120) NULL,
  PRIMARY KEY (`ContactoAdicionalId`),
  INDEX `PersonaIdContactoAdicional_idx` (`PersonaId` ASC),
  CONSTRAINT `PersonaIdContactoAdicional`
    FOREIGN KEY (`PersonaId`)
    REFERENCES `cocinasketapa1`.`Persona` (`PersonaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`UnidadNegocioPorPersona`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`UnidadNegocioPorPersona` (
  `UnidadNegocioPorPersonaId` INT NOT NULL AUTO_INCREMENT,
  `PersonaId` INT NOT NULL,
  `UnidadNegocioId` INT NOT NULL,
  PRIMARY KEY (`UnidadNegocioPorPersonaId`),
  INDEX `UnidadNegocioIdPersona_idx` (`UnidadNegocioId` ASC),
  INDEX `PersonaIdUnidadNegocio_idx` (`PersonaId` ASC),
  CONSTRAINT `PersonaIdUnidadNegocio`
    FOREIGN KEY (`PersonaId`)
    REFERENCES `cocinasketapa1`.`Persona` (`PersonaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `UnidadNegocioIdPersona`
    FOREIGN KEY (`UnidadNegocioId`)
    REFERENCES `cocinasketapa1`.`UnidadNegocio` (`UnidadNegocioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Nota`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Nota` (
  `NotaId` INT NOT NULL AUTO_INCREMENT,
  `ColaboradorId` INT NOT NULL,
  `PersonaId` INT NOT NULL,
  `Fecha` DATETIME NOT NULL,
  `Nota` VARCHAR(1000) NOT NULL,
  `Tema` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`NotaId`),
  INDEX `ColaboradorIdNota_idx` (`ColaboradorId` ASC),
  INDEX `PersonaIdNota_idx` (`PersonaId` ASC),
  CONSTRAINT `ColaboradorIdNota`
    FOREIGN KEY (`ColaboradorId`)
    REFERENCES `cocinasketapa1`.`Colaborador` (`ColaboradorId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `PersonaIdNota`
    FOREIGN KEY (`PersonaId`)
    REFERENCES `cocinasketapa1`.`Persona` (`PersonaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`Presupuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`Presupuesto` (
  `PresupuestoId` INT NOT NULL AUTO_INCREMENT,
  `ProyectoId` INT NOT NULL,
  `PersonaId` INT NOT NULL,
  PRIMARY KEY (`PresupuestoId`),
  INDEX `PersonaIdPresupuesto_idx` (`PersonaId` ASC),
  INDEX `ProyectoIdPresupuesto_idx` (`ProyectoId` ASC),
  CONSTRAINT `PersonaIdPresupuesto`
    FOREIGN KEY (`PersonaId`)
    REFERENCES `cocinasketapa1`.`Persona` (`PersonaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ProyectoIdPresupuesto`
    FOREIGN KEY (`ProyectoId`)
    REFERENCES `cocinasketapa1`.`Proyecto` (`ProyectoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ProductoCocinasK`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ProductoCocinasK` (
  `ProductoCocinasKId` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`ProductoCocinasKId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ProductoPorPresupuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ProductoPorPresupuesto` (
  `ProductoPorPresupuestoId` INT NOT NULL AUTO_INCREMENT,
  `PresupuestoId` INT NOT NULL,
  `ProductoCocinasKId` INT NOT NULL,
  PRIMARY KEY (`ProductoPorPresupuestoId`),
  INDEX `ProductoCocinasKIdPresupuesto_idx` (`ProductoCocinasKId` ASC),
  INDEX `PresupuestoIdProductoCocinasK_idx` (`PresupuestoId` ASC),
  CONSTRAINT `PresupuestoIdProductoCocinasK`
    FOREIGN KEY (`PresupuestoId`)
    REFERENCES `cocinasketapa1`.`Presupuesto` (`PresupuestoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ProductoCocinasKIdPresupuesto`
    FOREIGN KEY (`ProductoCocinasKId`)
    REFERENCES `cocinasketapa1`.`ProductoCocinasK` (`ProductoCocinasKId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`CombinacionPorPresupuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`CombinacionPorPresupuesto` (
  `CombinacionPorPresupuesto` INT NOT NULL AUTO_INCREMENT,
  `CombinacionMaterialId` INT NOT NULL,
  `PresupuestoId` INT NOT NULL,
  PRIMARY KEY (`CombinacionPorPresupuesto`),
  INDEX `CombinacionMaterialIdPresupuesto_idx` (`CombinacionMaterialId` ASC),
  INDEX `PresupuestoIdCombinacion_idx` (`PresupuestoId` ASC),
  CONSTRAINT `PresupuestoIdCombinacion`
    FOREIGN KEY (`PresupuestoId`)
    REFERENCES `cocinasketapa1`.`Presupuesto` (`PresupuestoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `CombinacionMaterialIdPresupuesto`
    FOREIGN KEY (`CombinacionMaterialId`)
    REFERENCES `cocinasketapa1`.`CombinacionMaterial` (`CombinacionMaterialId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`CubiertaPorPresupuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`CubiertaPorPresupuesto` (
  `CubiertaPorPresupuestoId` INT NOT NULL AUTO_INCREMENT,
  `TipoCubiertaId` INT NOT NULL,
  `PresupuestoId` INT NOT NULL,
  PRIMARY KEY (`CubiertaPorPresupuestoId`),
  INDEX `PresupuestoIdCubierta_idx` (`PresupuestoId` ASC),
  INDEX `TipoCubiertaIdPresupuesto_idx` (`TipoCubiertaId` ASC),
  CONSTRAINT `PresupuestoIdCubierta`
    FOREIGN KEY (`PresupuestoId`)
    REFERENCES `cocinasketapa1`.`Presupuesto` (`PresupuestoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `TipoCubiertaIdPresupuesto`
    FOREIGN KEY (`TipoCubiertaId`)
    REFERENCES `cocinasketapa1`.`TipoCubierta` (`TipoCubiertaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ModuloPresupuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ModuloPresupuesto` (
  `ModuloPresupuestoId` INT NOT NULL AUTO_INCREMENT,
  `MedidaPorModuloId` INT NOT NULL,
  `PresupuestoId` INT NOT NULL,
  `Cantidad` SMALLINT(6) NOT NULL,
  PRIMARY KEY (`ModuloPresupuestoId`),
  INDEX `PresupuestoIdMedidasPorModulo_idx` (`PresupuestoId` ASC),
  INDEX `MedidasPorModuloIdPresupuesto_idx` (`MedidaPorModuloId` ASC),
  CONSTRAINT `MedidasPorModuloIdPresupuesto`
    FOREIGN KEY (`MedidaPorModuloId`)
    REFERENCES `cocinasketapa1`.`MedidasPorModulo` (`MedidasPorModuloId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `PresupuestoIdMedidasPorModulo`
    FOREIGN KEY (`PresupuestoId`)
    REFERENCES `cocinasketapa1`.`Presupuesto` (`PresupuestoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`PrecioModuloPresupuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`PrecioModuloPresupuesto` (
  `PrecioModuloPresupuestoId` INT NOT NULL AUTO_INCREMENT,
  `ModuloPresupuestoId` INT NOT NULL,
  `CombinacionMaterialId` INT NOT NULL,
  `PrecioVenta` DECIMAL(6,2) NOT NULL,
  PRIMARY KEY (`PrecioModuloPresupuestoId`),
  INDEX `ModuloPresupuestoIdPrecio_idx` (`ModuloPresupuestoId` ASC),
  INDEX `CombinacionMaterialPrecioModulo_idx` (`CombinacionMaterialId` ASC),
  CONSTRAINT `ModuloPresupuestoIdPrecio`
    FOREIGN KEY (`ModuloPresupuestoId`)
    REFERENCES `cocinasketapa1`.`ModuloPresupuesto` (`ModuloPresupuestoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `CombinacionMaterialPrecioModulo`
    FOREIGN KEY (`CombinacionMaterialId`)
    REFERENCES `cocinasketapa1`.`CombinacionMaterial` (`CombinacionMaterialId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`ServicioPresupuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`ServicioPresupuesto` (
  `ServicioPresupuestoId` INT NOT NULL AUTO_INCREMENT,
  `ServicioId` INT NOT NULL,
  `PresupuestoId` INT NOT NULL,
  `PrecioVenta` VARCHAR(45) NOT NULL,
  `Cantidad` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`ServicioPresupuestoId`),
  INDEX `PresupuestoIdServicio_idx` (`PresupuestoId` ASC),
  INDEX `ServicioIdPresupuesto_idx` (`ServicioId` ASC),
  CONSTRAINT `ServicioIdPresupuesto`
    FOREIGN KEY (`ServicioId`)
    REFERENCES `cocinasketapa1`.`Servicio` (`ServicioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `PresupuestoIdServicio`
    FOREIGN KEY (`PresupuestoId`)
    REFERENCES `cocinasketapa1`.`Presupuesto` (`PresupuestoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`MaqueoPresupuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`MaqueoPresupuesto` (
  `MaqueoPresupuestoId` INT NOT NULL AUTO_INCREMENT,
  `MaqueoId` INT NOT NULL,
  `PresupuestoId` INT NOT NULL,
  `Cantidad` SMALLINT(6) NOT NULL,
  `PrecioVenta` DECIMAL(6,2) NOT NULL,
  PRIMARY KEY (`MaqueoPresupuestoId`),
  INDEX `MaqueoIdPresupuesto_idx` (`MaqueoId` ASC),
  INDEX `PresupuestoIdMaqueo_idx` (`PresupuestoId` ASC),
  CONSTRAINT `PresupuestoIdMaqueo`
    FOREIGN KEY (`PresupuestoId`)
    REFERENCES `cocinasketapa1`.`Presupuesto` (`PresupuestoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `MaqueoIdPresupuesto`
    FOREIGN KEY (`MaqueoId`)
    REFERENCES `cocinasketapa1`.`Maqueo` (`MaqueoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`PuertaPresupuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`PuertaPresupuesto` (
  `PuertaPresupuestoId` INT NOT NULL AUTO_INCREMENT,
  `MuestrarioId` INT NOT NULL,
  `PresupuestoId` INT NOT NULL,
  PRIMARY KEY (`PuertaPresupuestoId`),
  INDEX `PresupuestoIdMuestrario_idx` (`PresupuestoId` ASC),
  INDEX `MuestrarioIdPuertaPresupuesto_idx` (`MuestrarioId` ASC),
  CONSTRAINT `MuestrarioIdPuertaPresupuesto`
    FOREIGN KEY (`MuestrarioId`)
    REFERENCES `cocinasketapa1`.`Muestrario` (`MuestrarioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `PresupuestoIdMuestrario`
    FOREIGN KEY (`PresupuestoId`)
    REFERENCES `cocinasketapa1`.`Presupuesto` (`PresupuestoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`PrecioPuertaPresupuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`PrecioPuertaPresupuesto` (
  `PrecioPuertaPresupuestoId` INT NOT NULL AUTO_INCREMENT,
  `PuertaPresupuestoId` INT NOT NULL,
  `CombinacionMaterialId` INT NOT NULL,
  `PrecioVenta` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`PrecioPuertaPresupuestoId`),
  INDEX `CombinacionMaterialIdPrecioPuerta_idx` (`CombinacionMaterialId` ASC),
  INDEX `PuertaPresupuestoIdPrecio_idx` (`PuertaPresupuestoId` ASC),
  CONSTRAINT `PuertaPresupuestoIdPrecio`
    FOREIGN KEY (`PuertaPresupuestoId`)
    REFERENCES `cocinasketapa1`.`PuertaPresupuesto` (`PuertaPresupuestoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `CombinacionMaterialIdPrecioPuerta`
    FOREIGN KEY (`CombinacionMaterialId`)
    REFERENCES `cocinasketapa1`.`CombinacionMaterial` (`CombinacionMaterialId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`AccesorioPresupuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`AccesorioPresupuesto` (
  `AccesorioPresupuestoId` INT NOT NULL AUTO_INCREMENT,
  `TipoAccesorioId` INT NOT NULL,
  `PresupuestoId` INT NOT NULL,
  `Cantidad` SMALLINT(6) NOT NULL,
  PRIMARY KEY (`AccesorioPresupuestoId`),
  INDEX `TipoAccesorioIdPresupuesto_idx` (`TipoAccesorioId` ASC),
  INDEX `PresupuestoIdAccesorio_idx` (`PresupuestoId` ASC),
  CONSTRAINT `TipoAccesorioIdPresupuesto`
    FOREIGN KEY (`TipoAccesorioId`)
    REFERENCES `cocinasketapa1`.`TipoAccesorio` (`TipoAccesorioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `PresupuestoIdAccesorio`
    FOREIGN KEY (`PresupuestoId`)
    REFERENCES `cocinasketapa1`.`Presupuesto` (`PresupuestoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`MuestrarioAccesorioPresupuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`MuestrarioAccesorioPresupuesto` (
  `MuestrarioAccesorioPresupuestoId` INT NOT NULL AUTO_INCREMENT,
  `AccesorioPresupuestoId` INT NOT NULL,
  `MuestrarioId` INT NOT NULL,
  `PrecioVenta` DECIMAL(6,2) NULL,
  PRIMARY KEY (`MuestrarioAccesorioPresupuestoId`),
  INDEX `AccesorioPuertaId_idx` (`AccesorioPresupuestoId` ASC),
  INDEX `MuestrarioIdAccesorioPresupuesto_idx` (`MuestrarioId` ASC),
  CONSTRAINT `MuestrarioIdAccesorioPresupuesto`
    FOREIGN KEY (`MuestrarioId`)
    REFERENCES `cocinasketapa1`.`Muestrario` (`MuestrarioId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `AccesorioPuertaId`
    FOREIGN KEY (`AccesorioPresupuestoId`)
    REFERENCES `cocinasketapa1`.`AccesorioPresupuesto` (`AccesorioPresupuestoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`MuestrarioAccesorioCombinacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`MuestrarioAccesorioCombinacion` (
  `MuestrarioAccesorioCombinacionId` INT NOT NULL AUTO_INCREMENT,
  `MuestrarioAccesorioPresupuestoId` INT NOT NULL,
  `CombinacionMaterialId` INT NOT NULL,
  `PrecioVenta` DECIMAL(6,2) NOT NULL,
  PRIMARY KEY (`MuestrarioAccesorioCombinacionId`),
  INDEX `MuestrarioAccesorioPresupuestoId_idx` (`MuestrarioAccesorioPresupuestoId` ASC),
  CONSTRAINT `CombinacionMaterialIdMuestrarioAccesorio`
    FOREIGN KEY (`CombinacionMaterialId`)
    REFERENCES `cocinasketapa1`.`CombinacionMaterial` (`CombinacionMaterialId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `MuestrarioAccesorioPresupuestoId`
    FOREIGN KEY (`MuestrarioAccesorioPresupuestoId`)
    REFERENCES `cocinasketapa1`.`MuestrarioAccesorioPresupuesto` (`MuestrarioAccesorioPresupuestoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`UbicacionCubiertaPresupuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`UbicacionCubiertaPresupuesto` (
  `UbicacionCubiertaPresupuestoId` INT NOT NULL AUTO_INCREMENT,
  `TipoCubierta` INT NOT NULL,
  `UbicacionCubiertaId` INT NOT NULL,
  `PresupuestoId` INT NOT NULL,
  PRIMARY KEY (`UbicacionCubiertaPresupuestoId`),
  INDEX `TipoCubiertaIdUbicacionPresupuesto_idx` (`TipoCubierta` ASC),
  INDEX `PresupuestoIdUbicacionCubierta_idx` (`PresupuestoId` ASC),
  INDEX `UbicacionCubiartePresupuesto_idx` (`UbicacionCubiertaId` ASC),
  CONSTRAINT `TipoCubiertaIdUbicacionPresupuesto`
    FOREIGN KEY (`TipoCubierta`)
    REFERENCES `cocinasketapa1`.`TipoCubierta` (`TipoCubiertaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `PresupuestoIdUbicacionCubierta`
    FOREIGN KEY (`PresupuestoId`)
    REFERENCES `cocinasketapa1`.`Presupuesto` (`PresupuestoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `UbicacionCubiartePresupuesto`
    FOREIGN KEY (`UbicacionCubiertaId`)
    REFERENCES `cocinasketapa1`.`UbicacionCubierta` (`UbicacionCubiertaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`SeccionUbicacionCubiertaPresupuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`SeccionUbicacionCubiertaPresupuesto` (
  `SeccionUbicacionCubiertaPresupuestoId` INT NOT NULL,
  `UbicacionCubiertaPresupuestoId` INT NOT NULL,
  `Cantidad` SMALLINT(6) NULL,
  `Lado1` DECIMAL(6,2) NULL,
  `Lado2` DECIMAL(6,2) NULL,
  PRIMARY KEY (`SeccionUbicacionCubiertaPresupuestoId`),
  INDEX `UbicacionCubiertaPresupuestoId_idx` (`UbicacionCubiertaPresupuestoId` ASC),
  CONSTRAINT `UbicacionCubiertaPresupuestoId`
    FOREIGN KEY (`UbicacionCubiertaPresupuestoId`)
    REFERENCES `cocinasketapa1`.`UbicacionCubiertaPresupuesto` (`UbicacionCubiertaPresupuestoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cocinasketapa1`.`MaterialTipoCubiertaPresupuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`MaterialTipoCubiertaPresupuesto` (
  `MaterialTipoCubiertaPresupuestoId` INT NOT NULL AUTO_INCREMENT,
  `TipoCubiertaId` INT NOT NULL,
  `UbicacionCubiertaId` INT NULL,
  `PresupuestoId` INT NOT NULL,
  `ColorPorMaterialCubiertaId` INT NOT NULL,
  `PrecioVenta` DECIMAL(6,2) NOT NULL,
  PRIMARY KEY (`MaterialTipoCubiertaPresupuestoId`),
  INDEX `PresupuestoId_idx` (`PresupuestoId` ASC),
  INDEX `TipoCubiertaIdPresupuestoMaterial_idx` (`TipoCubiertaId` ASC),
  INDEX `UbicacionCubiertaIdMaterialPresupuesto_idx` (`UbicacionCubiertaId` ASC),
  INDEX `MaterialColorIdPresupuesto_idx` (`ColorPorMaterialCubiertaId` ASC),
  CONSTRAINT `MaterialColorIdPresupuesto`
    FOREIGN KEY (`ColorPorMaterialCubiertaId`)
    REFERENCES `cocinasketapa1`.`ColorPorMaterialCubierta` (`ColorPorMaterialCubiertaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `PresupuestoIdCubiertaMaterial`
    FOREIGN KEY (`PresupuestoId`)
    REFERENCES `cocinasketapa1`.`Presupuesto` (`PresupuestoId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `TipoCubiertaIdPresupuestoMaterial`
    FOREIGN KEY (`TipoCubiertaId`)
    REFERENCES `cocinasketapa1`.`TipoCubierta` (`TipoCubiertaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `UbicacionCubiertaIdMaterialPresupuesto`
    FOREIGN KEY (`UbicacionCubiertaId`)
    REFERENCES `cocinasketapa1`.`UbicacionCubierta` (`UbicacionCubiertaId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `cocinasketapa1` ;

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`colaboradorvista`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`colaboradorvista` (`ColaboradorId` INT, `UnidadNegocioId` INT, `PaisId` INT, `Nombre` INT, `PrimerApellido` INT, `SegundoApellido` INT, `Domicilio` INT, `Estado` INT, `Ciudad` INT, `Codigo` INT, `Colonia` INT, `Municipio` INT, `Activo` INT, `NombrePais` INT, `NombreUnidadNegocio` INT, `NombreTipoUnidadNegocio` INT, `NombreUsuario` INT, `UsuarioId` INT, `ActivoUsuario` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`combinacionmaterialvista`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`combinacionmaterialvista` (`CombinacionPorMaterialComponenteId` INT, `ComponenteId` INT, `CombinacionMaterialId` INT, `MaterialId` INT, `Grueso` INT, `Nombre` INT, `NombreMaterial` INT, `NombreComponente` INT, `NombreTipoMaterial` INT, `TipoMaterialId` INT, `ActivoComponente` INT, `ActivoCombinacionMaterial` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`componentepormodulovista`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`componentepormodulovista` (`ComponentePorModuloId` INT, `ComponenteId` INT, `ModuloId` INT, `Cantidad` INT, `NombreComponente` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`componenteporpuertavista`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`componenteporpuertavista` (`ComponentePorPuertaId` INT, `PuertaId` INT, `ComponenteId` INT, `PiezaId` INT, `Cantidad` INT, `NombreComponente` INT, `NombrePieza` INT, `PiezaPorComponentePuertaId` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`componentevista`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`componentevista` (`ComponenteId` INT, `TipoComponenteId` INT, `Nombre` INT, `Activo` INT, `NombrePieza` INT, `FormulaAncho` INT, `FormulaLargo` INT, `PiezaId` INT, `Cantidad` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`consumiblepormodulovista`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`consumiblepormodulovista` (`ConsumiblePorModuloId` INT, `ModuloId` INT, `ConsumibleId` INT, `Cantidad` INT, `NombreConsumible` INT, `Costo` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`contactocolaboradorvista`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`contactocolaboradorvista` (`ColaboradorId` INT, `Contacto` INT, `NombreTipoMedioContacto` INT, `NombreMedioContacto` INT, `MedioContactoColaboradorId` INT, `TipoMedioContactoId` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`materialvista`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`materialvista` (`MaterialId` INT, `TipoMaterialId` INT, `Nombre` INT, `CostoUnidad` INT, `Activo` INT, `NombreTipoMaterial` INT, `MaterialParaId` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`modulovista`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`modulovista` (`ModuloId` INT, `TipoModuloId` INT, `Nombre` INT, `Margen` INT, `Imagen` INT, `NumeroSeccion` INT, `Desperdicio` INT, `Activo` INT, `NombreTipoModulo` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`partepormodulovista`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`partepormodulovista` (`PartePorModuloId` INT, `ModuloId` INT, `TipoParteId` INT, `Ancho` INT, `NombrePieza` INT, `NombreTipoParte` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`permisovista`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`permisovista` (`PermisoId` INT, `PerfilId` INT, `ModuloGUIId` INT, `Seccion` INT, `Operacion` INT, `Clave` INT, `NombreModulo` INT, `NombrePerfil` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`plazavista`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`plazavista` (`PlazaId` INT, `UnidadNegocioId` INT, `TerritorioId` INT, `Estado` INT, `Municipio` INT, `Ciudad` INT, `Activo` INT, `NombreTerritorio` INT, `NombreUnidadNegocio` INT, `Margen` INT, `TipoUnidadNegocioId` INT, `NombreTipoUnidadNegocio` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`puertavista`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`puertavista` (`PuertaId` INT, `MuestrarioId` INT, `Nombre` INT, `Activo` INT, `NombreMuestrario` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`seccionpormodulovista`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`seccionpormodulovista` (`SeccionPorModuloId` INT, `SeccionModuloId` INT, `ModuloId` INT, `NumeroPiezas` INT, `PeinazoVertical` INT, `NombreSeccionModulo` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`tipomaterialvista`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`tipomaterialvista` (`TipoMaterialId` INT, `MaterialParaId` INT, `Nombre` INT, `Activo` INT, `NombreMaterialPara` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`tipomediocontactovista`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`tipomediocontactovista` (`NombreMedioContacto` INT, `TipoMedioContactoId` INT, `MedioContactoId` INT, `Nombre` INT, `Activo` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`usuariocompleto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`usuariocompleto` (`PermisoId` INT, `Modulo` INT, `Seccion` INT, `Operacion` INT, `Clave` INT, `NombrePerfil` INT, `PerfilId` INT, `NombreUsuario` INT, `UsuarioId` INT, `Password` INT, `Activo` INT, `NombreColaborador` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`usuariovista`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`usuariovista` (`ColaboradorId` INT, `UnidadNegocioId` INT, `PaisId` INT, `Nombre` INT, `PrimerApellido` INT, `SegundoApellido` INT, `Domicilio` INT, `Estado` INT, `Ciudad` INT, `Codigo` INT, `Colonia` INT, `Municipio` INT, `Activo` INT, `NombrePais` INT, `NombreUnidadNegocio` INT, `NombreTipoUnidadNegocio` INT, `NombreUsuario` INT, `UsuarioId` INT, `ActivoUsuario` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`vistaunidadnegocio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`vistaunidadnegocio` (`UnidadNegocioId` INT, `ColaboradorId` INT, `EmpresaId` INT, `TipoUnidadNegocioId` INT, `PaisId` INT, `Nombre` INT, `Telefono` INT, `Colonia` INT, `Estado` INT, `Ciudad` INT, `Codigo` INT, `Municipio` INT, `Domicilio` INT, `Activo` INT, `NombreEmpresa` INT, `NombrePais` INT, `colaborador` INT, `NombreTipoUnidadNegocio` INT);

-- -----------------------------------------------------
-- Placeholder table for view `cocinasketapa1`.`view1`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cocinasketapa1`.`view1` (`id` INT);

-- -----------------------------------------------------
-- View `cocinasketapa1`.`colaboradorvista`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`colaboradorvista`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`colaboradorvista` AS select `c`.`ColaboradorId` AS `ColaboradorId`,`c`.`UnidadNegocioId` AS `UnidadNegocioId`,`c`.`PaisId` AS `PaisId`,`c`.`Nombre` AS `Nombre`,`c`.`PrimerApellido` AS `PrimerApellido`,`c`.`SegundoApellido` AS `SegundoApellido`,`c`.`Domicilio` AS `Domicilio`,`c`.`Estado` AS `Estado`,`c`.`Ciudad` AS `Ciudad`,`c`.`Codigo` AS `Codigo`,`c`.`Colonia` AS `Colonia`,`c`.`Municipio` AS `Municipio`,`c`.`Activo` AS `Activo`,`p`.`Nombre` AS `NombrePais`,`u`.`Nombre` AS `NombreUnidadNegocio`,`tu`.`Nombre` AS `NombreTipoUnidadNegocio`,`user`.`Nombre` AS `NombreUsuario`,`user`.`UsuarioId` AS `UsuarioId`,`user`.`Activo` AS `ActivoUsuario` from (((`cocinasketapa1`.`unidadnegocio` `u` join `cocinasketapa1`.`pais` `p`) join `cocinasketapa1`.`tipounidadnegocio` `tu`) join (`cocinasketapa1`.`colaborador` `c` left join `cocinasketapa1`.`usuario` `user` on((`user`.`ColaboradorId` = `c`.`ColaboradorId`)))) where ((`c`.`PaisId` = `p`.`PaisId`) and (`c`.`UnidadNegocioId` = `u`.`UnidadNegocioId`) and (`u`.`TipoUnidadNegocioId` = `tu`.`TipoUnidadNegocioId`));

-- -----------------------------------------------------
-- View `cocinasketapa1`.`combinacionmaterialvista`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`combinacionmaterialvista`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`combinacionmaterialvista` AS select `cmc`.`CombinacionPorMaterialComponenteId` AS `CombinacionPorMaterialComponenteId`,`cmc`.`ComponenteId` AS `ComponenteId`,`cmc`.`CombinacionMaterialId` AS `CombinacionMaterialId`,`cmc`.`MaterialId` AS `MaterialId`,`cmc`.`Grueso` AS `Grueso`,`cm`.`Nombre` AS `Nombre`,`m`.`Nombre` AS `NombreMaterial`,`c`.`Nombre` AS `NombreComponente`,`tm`.`Nombre` AS `NombreTipoMaterial`,`tm`.`TipoMaterialId` AS `TipoMaterialId`,`c`.`Activo` AS `ActivoComponente`,`cm`.`Activo` AS `ActivoCombinacionMaterial` from ((((`cocinasketapa1`.`combinacionpormaterialcomponente` `cmc` join `cocinasketapa1`.`combinacionmaterial` `cm`) join `cocinasketapa1`.`material` `m`) join `cocinasketapa1`.`componente` `c`) join `cocinasketapa1`.`tipomaterial` `tm`) where ((`cmc`.`MaterialId` = `m`.`MaterialId`) and (`cmc`.`CombinacionMaterialId` = `cm`.`CombinacionMaterialId`) and (`cmc`.`ComponenteId` = `c`.`ComponenteId`) and (`tm`.`TipoMaterialId` = `m`.`TipoMaterialId`));

-- -----------------------------------------------------
-- View `cocinasketapa1`.`componentepormodulovista`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`componentepormodulovista`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`componentepormodulovista` AS select `cm`.`ComponentePorModuloId` AS `ComponentePorModuloId`,`cm`.`ComponenteId` AS `ComponenteId`,`cm`.`ModuloId` AS `ModuloId`,`cm`.`Cantidad` AS `Cantidad`,`c`.`Nombre` AS `NombreComponente` from (`cocinasketapa1`.`componente` `c` join `cocinasketapa1`.`componentepormodulo` `cm`) where (`c`.`ComponenteId` = `cm`.`ComponenteId`);

-- -----------------------------------------------------
-- View `cocinasketapa1`.`componenteporpuertavista`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`componenteporpuertavista`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`componenteporpuertavista` AS select `cp`.`ComponentePorPuertaId` AS `ComponentePorPuertaId`,`cp`.`PuertaId` AS `PuertaId`,`cp`.`ComponenteId` AS `ComponenteId`,`pc`.`PiezaId` AS `PiezaId`,`pc`.`Cantidad` AS `Cantidad`,`c`.`Nombre` AS `NombreComponente`,`p`.`Nombre` AS `NombrePieza`,`pc`.`PiezaPorComponentePuertaId` AS `PiezaPorComponentePuertaId` from (((`cocinasketapa1`.`componenteporpuerta` `cp` join `cocinasketapa1`.`piezaporcomponentepuerta` `pc`) join `cocinasketapa1`.`pieza` `p`) join `cocinasketapa1`.`componente` `c`) where ((`cp`.`ComponentePorPuertaId` = `pc`.`ComponentePorPuertaId`) and (`p`.`PiezaId` = `pc`.`PiezaId`) and (`c`.`ComponenteId` = `cp`.`ComponenteId`));

-- -----------------------------------------------------
-- View `cocinasketapa1`.`componentevista`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`componentevista`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`componentevista` AS select `c`.`ComponenteId` AS `ComponenteId`,`c`.`TipoComponenteId` AS `TipoComponenteId`,`c`.`Nombre` AS `Nombre`,`c`.`Activo` AS `Activo`,`p`.`Nombre` AS `NombrePieza`,`p`.`FormulaAncho` AS `FormulaAncho`,`p`.`FormulaLargo` AS `FormulaLargo`,`p`.`PiezaId` AS `PiezaId`,`pc`.`Cantidad` AS `Cantidad` from ((`cocinasketapa1`.`componente` `c` join `cocinasketapa1`.`piezaporcomponente` `pc`) join `cocinasketapa1`.`pieza` `p`) where ((`c`.`ComponenteId` = `pc`.`ComponenteId`) and (`p`.`PiezaId` = `pc`.`PiezaId`));

-- -----------------------------------------------------
-- View `cocinasketapa1`.`consumiblepormodulovista`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`consumiblepormodulovista`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`consumiblepormodulovista` AS select `cm`.`ConsumiblePorModuloId` AS `ConsumiblePorModuloId`,`cm`.`ModuloId` AS `ModuloId`,`cm`.`ConsumibleId` AS `ConsumibleId`,`cm`.`Cantidad` AS `Cantidad`,`c`.`Nombre` AS `NombreConsumible`,`c`.`Costo` AS `Costo` from (`cocinasketapa1`.`consumible` `c` join `cocinasketapa1`.`consumiblepormodulo` `cm`) where (`c`.`ConsumibleId` = `cm`.`ConsumibleId`);

-- -----------------------------------------------------
-- View `cocinasketapa1`.`contactocolaboradorvista`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`contactocolaboradorvista`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`contactocolaboradorvista` AS select `c`.`ColaboradorId` AS `ColaboradorId`,`c`.`Contacto` AS `Contacto`,`tm`.`Nombre` AS `NombreTipoMedioContacto`,`m`.`Nombre` AS `NombreMedioContacto`,`c`.`MedioContactoColaboradorId` AS `MedioContactoColaboradorId`,`tm`.`TipoMedioContactoId` AS `TipoMedioContactoId` from ((`cocinasketapa1`.`contactocolaborador` `c` join `cocinasketapa1`.`tipomediocontacto` `tm`) join `cocinasketapa1`.`mediocontacto` `m`) where ((`c`.`TipoMedioContactoId` = `tm`.`TipoMedioContactoId`) and (`tm`.`MedioContactoId` = `m`.`MedioContactoId`));

-- -----------------------------------------------------
-- View `cocinasketapa1`.`materialvista`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`materialvista`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`materialvista` AS select `m`.`MaterialId` AS `MaterialId`,`m`.`TipoMaterialId` AS `TipoMaterialId`,`m`.`Nombre` AS `Nombre`,`m`.`CostoUnidad` AS `CostoUnidad`,`m`.`Activo` AS `Activo`,`tm`.`Nombre` AS `NombreTipoMaterial`,`mp`.`MaterialParaId` AS `MaterialParaId` from ((`cocinasketapa1`.`material` `m` join `cocinasketapa1`.`tipomaterial` `tm`) join `cocinasketapa1`.`materialpara` `mp`) where ((`m`.`TipoMaterialId` = `tm`.`TipoMaterialId`) and (`mp`.`MaterialParaId` = `tm`.`MaterialParaId`));

-- -----------------------------------------------------
-- View `cocinasketapa1`.`modulovista`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`modulovista`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`modulovista` AS select `m`.`ModuloId` AS `ModuloId`,`m`.`TipoModuloId` AS `TipoModuloId`,`m`.`Nombre` AS `Nombre`,`m`.`Margen` AS `Margen`,`m`.`Imagen` AS `Imagen`,`m`.`NumeroSeccion` AS `NumeroSeccion`,`m`.`Desperdicio` AS `Desperdicio`,`m`.`Activo` AS `Activo`,`tm`.`Nombre` AS `NombreTipoModulo` from (`cocinasketapa1`.`modulo` `m` join `cocinasketapa1`.`tipomodulo` `tm`) where (`m`.`TipoModuloId` = `tm`.`TipoModuloId`);

-- -----------------------------------------------------
-- View `cocinasketapa1`.`partepormodulovista`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`partepormodulovista`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`partepormodulovista` AS select `pm`.`PartePorModuloId` AS `PartePorModuloId`,`pm`.`ModuloId` AS `ModuloId`,`pm`.`TipoParteId` AS `TipoParteId`,`pm`.`Ancho` AS `Ancho`,`pm`.`NombrePieza` AS `NombrePieza`,`tp`.`Nombre` AS `NombreTipoParte` from (`cocinasketapa1`.`partepormodulo` `pm` join `cocinasketapa1`.`tipoparte` `tp`) where (`pm`.`TipoParteId` = `tp`.`TipoParteId`);

-- -----------------------------------------------------
-- View `cocinasketapa1`.`permisovista`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`permisovista`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`permisovista` AS select `p`.`PermisoId` AS `PermisoId`,`p`.`PerfilId` AS `PerfilId`,`p`.`ModuloGUIId` AS `ModuloGUIId`,`p`.`Seccion` AS `Seccion`,`p`.`Operacion` AS `Operacion`,`p`.`Clave` AS `Clave`,`m`.`Nombre` AS `NombreModulo`,`pf`.`Nombre` AS `NombrePerfil` from ((`cocinasketapa1`.`permiso` `p` join `cocinasketapa1`.`modulogui` `m`) join `cocinasketapa1`.`perfil` `pf`) where ((`p`.`ModuloGUIId` = `m`.`ModuloGUIId`) and (`p`.`PerfilId` = `pf`.`PerfilId`));

-- -----------------------------------------------------
-- View `cocinasketapa1`.`plazavista`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`plazavista`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`plazavista` AS select `p`.`PlazaId` AS `PlazaId`,`p`.`UnidadNegocioId` AS `UnidadNegocioId`,`p`.`TerritorioId` AS `TerritorioId`,`p`.`Estado` AS `Estado`,`p`.`Municipio` AS `Municipio`,`p`.`Ciudad` AS `Ciudad`,`p`.`Activo` AS `Activo`,`t`.`Nombre` AS `NombreTerritorio`,`u`.`Nombre` AS `NombreUnidadNegocio`,`t`.`Margen` AS `Margen`,`tu`.`TipoUnidadNegocioId` AS `TipoUnidadNegocioId`,`tu`.`Nombre` AS `NombreTipoUnidadNegocio` from (((`cocinasketapa1`.`plaza` `p` join `cocinasketapa1`.`territorio` `t`) join `cocinasketapa1`.`unidadnegocio` `u`) join `cocinasketapa1`.`tipounidadnegocio` `tu`) where ((`p`.`TerritorioId` = `t`.`TerritorioId`) and (`p`.`UnidadNegocioId` = `u`.`UnidadNegocioId`) and (`tu`.`TipoUnidadNegocioId` = `u`.`TipoUnidadNegocioId`));

-- -----------------------------------------------------
-- View `cocinasketapa1`.`puertavista`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`puertavista`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`puertavista` AS select `p`.`PuertaId` AS `PuertaId`,`p`.`MuestrarioId` AS `MuestrarioId`,`p`.`Nombre` AS `Nombre`,`p`.`Activo` AS `Activo`,`m`.`Nombre` AS `NombreMuestrario` from (`cocinasketapa1`.`puerta` `p` join `cocinasketapa1`.`muestrario` `m`) where (`p`.`MuestrarioId` = `m`.`MuestrarioId`);

-- -----------------------------------------------------
-- View `cocinasketapa1`.`seccionpormodulovista`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`seccionpormodulovista`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`seccionpormodulovista` AS select `sm`.`SeccionPorModuloId` AS `SeccionPorModuloId`,`sm`.`SeccionModuloId` AS `SeccionModuloId`,`sm`.`ModuloId` AS `ModuloId`,`sm`.`NumeroPiezas` AS `NumeroPiezas`,`sm`.`PeinazoVertical` AS `PeinazoVertical`,`s`.`Nombre` AS `NombreSeccionModulo` from (`cocinasketapa1`.`seccionpormodulo` `sm` join `cocinasketapa1`.`seccionmodulo` `s`) where (`sm`.`SeccionModuloId` = `s`.`SeccionModuloId`);

-- -----------------------------------------------------
-- View `cocinasketapa1`.`tipomaterialvista`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`tipomaterialvista`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`tipomaterialvista` AS select `tm`.`TipoMaterialId` AS `TipoMaterialId`,`tm`.`MaterialParaId` AS `MaterialParaId`,`tm`.`Nombre` AS `Nombre`,`tm`.`Activo` AS `Activo`,`mp`.`Nombre` AS `NombreMaterialPara` from (`cocinasketapa1`.`tipomaterial` `tm` join `cocinasketapa1`.`materialpara` `mp`) where (`tm`.`MaterialParaId` = `mp`.`MaterialParaId`);

-- -----------------------------------------------------
-- View `cocinasketapa1`.`tipomediocontactovista`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`tipomediocontactovista`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`tipomediocontactovista` AS select `m`.`Nombre` AS `NombreMedioContacto`,`t`.`TipoMedioContactoId` AS `TipoMedioContactoId`,`t`.`MedioContactoId` AS `MedioContactoId`,`t`.`Nombre` AS `Nombre`,`t`.`Activo` AS `Activo` from (`cocinasketapa1`.`mediocontacto` `m` join `cocinasketapa1`.`tipomediocontacto` `t`) where (`m`.`MedioContactoId` = `t`.`MedioContactoId`);

-- -----------------------------------------------------
-- View `cocinasketapa1`.`usuariocompleto`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`usuariocompleto`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`usuariocompleto` AS select `pe`.`PermisoId` AS `PermisoId`,`m`.`Nombre` AS `Modulo`,`pe`.`Seccion` AS `Seccion`,`pe`.`Operacion` AS `Operacion`,`pe`.`Clave` AS `Clave`,`p`.`Nombre` AS `NombrePerfil`,`p`.`PerfilId` AS `PerfilId`,`U`.`Nombre` AS `NombreUsuario`,`U`.`UsuarioId` AS `UsuarioId`,`U`.`Password` AS `Password`,`U`.`Activo` AS `Activo`,`c`.`Nombre` AS `NombreColaborador` from ((((((`cocinasketapa1`.`perfil` `p` join `cocinasketapa1`.`usuario` `U`) join `cocinasketapa1`.`perfilporusuario` `pu`) join `cocinasketapa1`.`permiso` `pe`) join `cocinasketapa1`.`permisoporusuario` `peu`) join `cocinasketapa1`.`modulogui` `m`) join `cocinasketapa1`.`colaborador` `c`) where ((`pu`.`UsuarioId` = `U`.`UsuarioId`) and (`pu`.`PerfilId` = `p`.`PerfilId`) and (`peu`.`PermisoId` = `pe`.`PermisoId`) and (`peu`.`UsuarioId` = `U`.`UsuarioId`) and (`pe`.`ModuloGUIId` = `m`.`ModuloGUIId`) and (`pe`.`PerfilId` = `p`.`PerfilId`) and (`c`.`ColaboradorId` = `U`.`ColaboradorId`));

-- -----------------------------------------------------
-- View `cocinasketapa1`.`usuariovista`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`usuariovista`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`usuariovista` AS select `c`.`ColaboradorId` AS `ColaboradorId`,`c`.`UnidadNegocioId` AS `UnidadNegocioId`,`c`.`PaisId` AS `PaisId`,`c`.`Nombre` AS `Nombre`,`c`.`PrimerApellido` AS `PrimerApellido`,`c`.`SegundoApellido` AS `SegundoApellido`,`c`.`Domicilio` AS `Domicilio`,`c`.`Estado` AS `Estado`,`c`.`Ciudad` AS `Ciudad`,`c`.`Codigo` AS `Codigo`,`c`.`Colonia` AS `Colonia`,`c`.`Municipio` AS `Municipio`,`c`.`Activo` AS `Activo`,`p`.`Nombre` AS `NombrePais`,`u`.`Nombre` AS `NombreUnidadNegocio`,`tu`.`Nombre` AS `NombreTipoUnidadNegocio`,`user`.`Nombre` AS `NombreUsuario`,`user`.`UsuarioId` AS `UsuarioId`,`user`.`Activo` AS `ActivoUsuario` from ((((`cocinasketapa1`.`unidadnegocio` `u` join `cocinasketapa1`.`pais` `p`) join `cocinasketapa1`.`tipounidadnegocio` `tu`) join `cocinasketapa1`.`colaborador` `c`) join `cocinasketapa1`.`usuario` `user`) where ((`c`.`PaisId` = `p`.`PaisId`) and (`c`.`UnidadNegocioId` = `u`.`UnidadNegocioId`) and (`u`.`TipoUnidadNegocioId` = `tu`.`TipoUnidadNegocioId`) and (`user`.`ColaboradorId` = `c`.`ColaboradorId`));

-- -----------------------------------------------------
-- View `cocinasketapa1`.`vistaunidadnegocio`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`vistaunidadnegocio`;
USE `cocinasketapa1`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `cocinasketapa1`.`vistaunidadnegocio` AS select `un`.`UnidadNegocioId` AS `UnidadNegocioId`,`un`.`ColaboradorId` AS `ColaboradorId`,`un`.`EmpresaId` AS `EmpresaId`,`un`.`TipoUnidadNegocioId` AS `TipoUnidadNegocioId`,`un`.`PaisId` AS `PaisId`,`un`.`Nombre` AS `Nombre`,`un`.`Telefono` AS `Telefono`,`un`.`Colonia` AS `Colonia`,`un`.`Estado` AS `Estado`,`un`.`Ciudad` AS `Ciudad`,`un`.`Codigo` AS `Codigo`,`un`.`Municipio` AS `Municipio`,`un`.`Domicilio` AS `Domicilio`,`un`.`Activo` AS `Activo`,`e`.`Nombre` AS `NombreEmpresa`,`p`.`Nombre` AS `NombrePais`,concat(`c`.`Nombre`,' ',`c`.`PrimerApellido`,' ',`c`.`SegundoApellido`) AS `colaborador`,`tun`.`Nombre` AS `NombreTipoUnidadNegocio` from ((((`cocinasketapa1`.`unidadnegocio` `un` join `cocinasketapa1`.`empresa` `e`) join `cocinasketapa1`.`pais` `p`) join `cocinasketapa1`.`colaborador` `c`) join `cocinasketapa1`.`tipounidadnegocio` `tun`) where ((`un`.`EmpresaId` = `e`.`EmpresaId`) and (`p`.`PaisId` = `un`.`EmpresaId`) and (`c`.`ColaboradorId` = `un`.`ColaboradorId`) and (`tun`.`TipoUnidadNegocioId` = `un`.`TipoUnidadNegocioId`));

-- -----------------------------------------------------
-- View `cocinasketapa1`.`view1`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cocinasketapa1`.`view1`;
USE `cocinasketapa1`;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
