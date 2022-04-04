-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema gescon
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema gescon
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `gescon` DEFAULT CHARACTER SET utf8 ;
USE `gescon` ;

-- -----------------------------------------------------
-- Table `gescon`.`TipoUsuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gescon`.`TipoUsuario` (
  `idTipoUsuario` INT NOT NULL AUTO_INCREMENT,
  `rol` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idTipoUsuario`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gescon`.`Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gescon`.`Usuario` (
  `idUsuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `correo` VARCHAR(45) NOT NULL,
  `clave` VARCHAR(45) NOT NULL,
  `TipoUsuario_idTipoUsuario` INT NOT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE INDEX `correo_UNIQUE` (`correo` ASC) VISIBLE,
  INDEX `fk_Usuario_TipoUsuario_idx` (`TipoUsuario_idTipoUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_Usuario_TipoUsuario`
    FOREIGN KEY (`TipoUsuario_idTipoUsuario`)
    REFERENCES `gescon`.`TipoUsuario` (`idTipoUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gescon`.`Articulo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gescon`.`Articulo` (
  `idArticulo` INT NOT NULL AUTO_INCREMENT,
  `Tema` VARCHAR(45) NOT NULL,
  `Articulocol` VARCHAR(45) NOT NULL,
  `Usuario_idUsuario` INT NOT NULL,
  PRIMARY KEY (`idArticulo`),
  INDEX `fk_Articulo_Usuario1_idx` (`Usuario_idUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_Articulo_Usuario1`
    FOREIGN KEY (`Usuario_idUsuario`)
    REFERENCES `gescon`.`Usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gescon`.`Estado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gescon`.`Estado` (
  `idEstado` INT NOT NULL AUTO_INCREMENT,
  `estatus` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idEstado`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gescon`.`Sesion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gescon`.`Sesion` (
  `idSesion` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  PRIMARY KEY (`idSesion`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gescon`.`Evento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gescon`.`Evento` (
  `idEvento` INT NOT NULL AUTO_INCREMENT,
  `lugar` VARCHAR(100) NOT NULL,
  `fecha` DATE NOT NULL,
  PRIMARY KEY (`idEvento`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gescon`.`Version`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gescon`.`Version` (
  `idVersion` INT NOT NULL AUTO_INCREMENT,
  `numeroversion` VARCHAR(45) NOT NULL,
  `archivo` VARCHAR(45) NOT NULL,
  `comentario` VARCHAR(150) NULL,
  `Articulo_idArticulo` INT NOT NULL,
  `Estado_idEstado` INT NOT NULL,
  `Sesion_idSesion` INT NOT NULL,
  PRIMARY KEY (`idVersion`),
  INDEX `fk_Version_Articulo1_idx` (`Articulo_idArticulo` ASC) VISIBLE,
  INDEX `fk_Version_Estado1_idx` (`Estado_idEstado` ASC) VISIBLE,
  INDEX `fk_Version_Sesion1_idx` (`Sesion_idSesion` ASC) VISIBLE,
  CONSTRAINT `fk_Version_Articulo1`
    FOREIGN KEY (`Articulo_idArticulo`)
    REFERENCES `gescon`.`Articulo` (`idArticulo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Version_Estado1`
    FOREIGN KEY (`Estado_idEstado`)
    REFERENCES `gescon`.`Estado` (`idEstado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Version_Sesion1`
    FOREIGN KEY (`Sesion_idSesion`)
    REFERENCES `gescon`.`Sesion` (`idSesion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gescon`.`Version_has_Evento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gescon`.`Version_has_Evento` (
  `Version_idVersion` INT NOT NULL,
  `Evento_idEvento` INT NOT NULL,
  `hora` VARCHAR(45) NOT NULL COMMENT 'cambiar tipo a time',
  `seccion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Version_idVersion`, `Evento_idEvento`),
  INDEX `fk_Version_has_Evento_Evento1_idx` (`Evento_idEvento` ASC) VISIBLE,
  INDEX `fk_Version_has_Evento_Version1_idx` (`Version_idVersion` ASC) VISIBLE,
  CONSTRAINT `fk_Version_has_Evento_Version1`
    FOREIGN KEY (`Version_idVersion`)
    REFERENCES `gescon`.`Version` (`idVersion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Version_has_Evento_Evento1`
    FOREIGN KEY (`Evento_idEvento`)
    REFERENCES `gescon`.`Evento` (`idEvento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
