import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const host = request.headers.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app";

  if (code) {
    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
            );
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[auth/callback] exchangeCodeForSession error:", error.message, error.status);
    }

    if (!error) {
      // Password recovery flow — redirect to reset page
      if (data.user?.recovery_sent_at) {
        return NextResponse.redirect(`${origin}/reset-password`, {
          headers: response.headers,
        });
      }

      // Send welcome email only on first login (onboarding not yet completed)
      const user = data.user;
      if (user?.email) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed, display_name")
          .eq("id", user.id)
          .single();

        if (profile && !profile.onboarding_completed) {
          const name =
            profile.display_name ??
            user.user_metadata?.full_name ??
            user.user_metadata?.name ??
            user.email.split("@")[0];

          await resend.emails.send({
            from: "MyToys Crate <hello@mytoys-crate.com>",
            to: user.email,
            subject: "Welcome to MyToysCrate! 🧶",
            html: buildWelcomeEmail(name),
          });
        }
      }

      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}

function buildWelcomeEmail(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to MyToysCrate</title>
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header band -->
          <tr>
            <td style="background:#2d5f7a;padding:28px 40px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">MyToys<span style="color:#c9a96e;">Crate</span></p>
              <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.55);letter-spacing:1px;text-transform:uppercase;">mytoys-crate.com</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a2e3b;">Hi ${name}! 👋</p>
              <p style="margin:0 0 24px;font-size:15px;color:#5a6a75;line-height:1.6;">
                Welcome to <strong>MyToysCrate</strong> - the place where your plushie ideas become real crochet patterns. We're so happy to have you here!
              </p>

              <!-- 3 steps -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 16px;background:#f9f6f2;border-radius:10px;border-left:3px solid #2d5f7a;margin-bottom:10px;">
                    <p style="margin:0;font-size:13px;font-weight:700;color:#1a2e3b;">1. Design your plushie</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#5a6a75;">Head to the Studio and pick your animal, size, colors, and accessories.</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:14px 16px;background:#f9f6f2;border-radius:10px;border-left:3px solid #c9a96e;">
                    <p style="margin:0;font-size:13px;font-weight:700;color:#1a2e3b;">2. Download the pattern</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#5a6a75;">Get a detailed, beautifully formatted PDF pattern instantly - your first one is free!</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:14px 16px;background:#f9f6f2;border-radius:10px;border-left:3px solid #5a8fa8;">
                    <p style="margin:0;font-size:13px;font-weight:700;color:#1a2e3b;">3. Start crocheting</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#5a6a75;">Follow the step-by-step instructions and bring your plushie to life. Share it with us!</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://mytoys-crate.com/app/studio" style="display:inline-block;padding:14px 36px;background:#c9a96e;color:#1a2e3b;font-size:15px;font-weight:700;text-decoration:none;border-radius:12px;letter-spacing:0.2px;">
                      Go to Studio ->
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #f0ebe4;text-align:center;">
              <p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;">
                Questions? Reply to this email or reach us at <a href="mailto:hello@mytoys-crate.com" style="color:#2d5f7a;text-decoration:none;">hello@mytoys-crate.com</a>
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#ccc;">© 2026 MyToysCrate. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
