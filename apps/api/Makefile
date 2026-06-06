# Makefile for python project (api)

# Variables
PYTHON = python
VENV_DIR = .venv
VENV_BIN = $(VENV_DIR)/Scripts
PIP = $(VENV_BIN)/pip
UVICORN = $(VENV_BIN)/uvicorn
PORT = 8000
HOST = 127.0.0.1

.PHONY: help setup run clean install test lint

help:
	@echo "Available commands:"
	@echo "  make setup      - Create virtual environment and install dependencies"
	@echo "  make install    - Install/update dependencies from requirements.txt"
	@echo "  make run        - Start the FastAPI backend server using uvicorn"
	@echo "  make test       - Run tests (if pytest is installed/added)"
	@echo "  make lint       - Run code formatting or linting checks (e.g. ruff or flake8)"
	@echo "  make clean      - Remove virtual environment, pycache, and logs"

setup: $(VENV_DIR)/touchfile

$(VENV_DIR)/touchfile: requirements.txt
	@echo "Creating virtual environment..."
	$(PYTHON) -m venv $(VENV_DIR)
	@echo "Upgrading pip..."
	$(PIP) install --upgrade pip
	@echo "Installing dependencies..."
	$(PIP) install -r requirements.txt
	touch $(VENV_DIR)/touchfile

install:
	@echo "Installing dependencies..."
	$(PIP) install -r requirements.txt

run:
	@echo "Starting FastAPI server on $(HOST):$(PORT)..."
	$(UVICORN) app.main:app --reload --host $(HOST) --port $(PORT)

test:
	$(VENV_BIN)/pytest

lint:
	$(VENV_BIN)/black --check app
	$(VENV_BIN)/ruff check app

clean:
	@echo "Cleaning temporary files and virtual environment..."
	rmdir /s /q $(VENV_DIR) 2>nul || rm -rf $(VENV_DIR)
	rmdir /s /q app\__pycache__ 2>nul || rm -rf app/__pycache__
	del /f /q *.log 2>nul || rm -f *.log
