# ---- BUILD STAGE ----
FROM python:3.11-slim as builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --user -r requirements.txt

# ---- FINAL STAGE ----
FROM python:3.11-slim

WORKDIR /app

COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]