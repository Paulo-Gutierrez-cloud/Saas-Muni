import emails
from .config import settings

def send_opportunity_email(tender_name, tender_id, score, region):
    """
    Envía un email formateado con la oportunidad detectada.
    """
    html_content = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2563eb;">🚀 Nueva Oportunidad TI Detectada</h2>
        <p>Hemos encontrado una licitación con un alto match para tu perfil:</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">
            <p><strong>Nombre:</strong> {tender_name}</p>
            <p><strong>ID:</strong> {tender_id}</p>
            <p><strong>Match:</strong> <span style="color: #16a34a; font-weight: bold;">{score}%</span></p>
            <p><strong>Región:</strong> {region}</p>
        </div>
        <p style="margin-top: 20px;">
            <a href="http://localhost:3000" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver en Dashboard</a>
        </p>
        <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #64748b;">Este es un mensaje automático de Licitaciones TI.</p>
    </div>
    """

    message = emails.html(
        html=html_content,
        subject=f"🔥 Oportunidad TI ({score}%): {tender_name[:40]}...",
        mail_from=settings.SMTP_FROM
    )

    try:
        r = message.send(
            to=settings.NOTIFY_EMAIL,
            smtp={
                "host": settings.SMTP_HOST,
                "port": settings.SMTP_PORT,
                "user": settings.SMTP_USER,
                "password": settings.SMTP_PASSWORD,
                "tls": True
            }
        )
        return r.status_code == 250
    except Exception as e:
        print(f"Error enviando email: {e}")
        return False
