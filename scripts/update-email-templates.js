#!/usr/bin/env node

/**
 * Supabase Email Templates Update Script for Prism Focus
 *
 * This script updates your Supabase auth email templates with professional, branded designs
 *
 * Usage: node scripts/update-email-templates.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ Error: .env.local not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const supabaseUrlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);

if (!supabaseUrlMatch) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
  process.exit(1);
}

const supabaseUrl = supabaseUrlMatch[1].trim();
const projectRef = supabaseUrl.split('https://')[1].split('.')[0];

console.log(`📦 Project Reference: ${projectRef}`);
console.log('');
console.log('To complete this script, you need your Supabase Access Token.');
console.log('Get it from: https://supabase.com/dashboard/account/tokens');
console.log('');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your Supabase Access Token: ', async (token) => {
  if (!token) {
    console.error('❌ Error: Access token not provided');
    rl.close();
    process.exit(1);
  }

  const accessToken = token.trim();

  try {
    console.log('');
    console.log('🔄 Updating email templates...');
    console.log('');

    const emailTemplates = {
      mailer_subjects_magic_link: '🌈 Your Prism Focus Magic Link',
      mailer_templates_magic_link_content: `<html><body style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f9fafb; margin: 0; padding: 0;"><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><table width="100%" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);"><tr><td style="padding: 40px 20px; text-align: center;"><div style="margin-bottom: 30px;"><img src="https://prism.fractionfoundry.com/assets/prism_logo.png" alt="Prism Focus" style="height: 60px; width: auto;"></div><h1 style="color: #111827; font-size: 28px; font-weight: bold; margin: 0 0 20px 0;">Welcome Back! 🎉</h1><p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">Click the button below to log in to Prism Focus and connect with the LGBTQ+ founder community.</p><div style="margin: 30px 0;"><a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">Log In to Prism Focus</a></div><p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0;">Or copy this link if the button doesn't work:<br><code style="background-color: #f3f4f6; padding: 8px 12px; border-radius: 4px; color: #111827; word-break: break-all;">{{ .ConfirmationURL }}</code></p><hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"><p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0;">This link expires in 24 hours. If you didn't request this email, you can safely ignore it.</p></td></tr></table></div></body></html>`,

      mailer_subjects_confirmation: '🌈 Confirm Your Prism Focus Account',
      mailer_templates_confirmation_content: `<html><body style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f9fafb; margin: 0; padding: 0;"><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><table width="100%" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);"><tr><td style="padding: 40px 20px; text-align: center;"><div style="margin-bottom: 30px;"><img src="https://prism.fractionfoundry.com/assets/prism_logo.png" alt="Prism Focus" style="height: 60px; width: auto;"></div><h1 style="color: #111827; font-size: 28px; font-weight: bold; margin: 0 0 20px 0;">Confirm Your Email</h1><p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">Thanks for signing up for Prism Focus! Click the button below to confirm your email address and get started.</p><div style="margin: 30px 0;"><a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">Confirm Email</a></div><p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0;">Or copy this link if the button doesn't work:<br><code style="background-color: #f3f4f6; padding: 8px 12px; border-radius: 4px; color: #111827; word-break: break-all;">{{ .ConfirmationURL }}</code></p><hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"><p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0;">This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.</p></td></tr></table></div></body></html>`,

      mailer_subjects_recovery: '🔐 Reset Your Prism Focus Password',
      mailer_templates_recovery_content: `<html><body style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f9fafb; margin: 0; padding: 0;"><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><table width="100%" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);"><tr><td style="padding: 40px 20px; text-align: center;"><div style="margin-bottom: 30px;"><img src="https://prism.fractionfoundry.com/assets/prism_logo.png" alt="Prism Focus" style="height: 60px; width: auto;"></div><h1 style="color: #111827; font-size: 28px; font-weight: bold; margin: 0 0 20px 0;">Reset Your Password</h1><p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">We received a request to reset your Prism Focus password. Click the button below to create a new password.</p><div style="margin: 30px 0;"><a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">Reset Password</a></div><p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0;">Or copy this link if the button doesn't work:<br><code style="background-color: #f3f4f6; padding: 8px 12px; border-radius: 4px; color: #111827; word-break: break-all;">{{ .ConfirmationURL }}</code></p><hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"><p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p></td></tr></table></div></body></html>`,

      mailer_subjects_invite: '🎉 You\'re Invited to Prism Focus',
      mailer_templates_invite_content: `<html><body style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f9fafb; margin: 0; padding: 0;"><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><table width="100%" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);"><tr><td style="padding: 40px 20px; text-align: center;"><div style="margin-bottom: 30px;"><img src="https://prism.fractionfoundry.com/assets/prism_logo.png" alt="Prism Focus" style="height: 60px; width: auto;"></div><h1 style="color: #111827; font-size: 28px; font-weight: bold; margin: 0 0 20px 0;">You\'re Invited! 🌈</h1><p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">You\'ve been invited to join Prism Focus, the community platform for LGBTQ+ founders. Click the button below to accept the invitation and get started.</p><div style="margin: 30px 0;"><a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">Accept Invitation</a></div><p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0;">Or copy this link if the button doesn't work:<br><code style="background-color: #f3f4f6; padding: 8px 12px; border-radius: 4px; color: #111827; word-break: break-all;">{{ .ConfirmationURL }}</code></p><hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"><p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0;">This link expires in 7 days. If you didn\'t expect this invitation, you can safely ignore it.</p></td></tr></table></div></body></html>`,

      mailer_subjects_email_change: '🔐 Confirm Your New Email',
      mailer_templates_email_change_content: `<html><body style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f9fafb; margin: 0; padding: 0;"><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><table width="100%" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);"><tr><td style="padding: 40px 20px; text-align: center;"><div style="margin-bottom: 30px;"><img src="https://prism.fractionfoundry.com/assets/prism_logo.png" alt="Prism Focus" style="height: 60px; width: auto;"></div><h1 style="color: #111827; font-size: 28px; font-weight: bold; margin: 0 0 20px 0;">Confirm Your New Email</h1><p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">We received a request to change your email address. Click the button below to confirm the new email.</p><div style="margin: 30px 0;"><a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">Confirm Email Change</a></div><p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0;">Or copy this link if the button doesn't work:<br><code style="background-color: #f3f4f6; padding: 8px 12px; border-radius: 4px; color: #111827; word-break: break-all;">{{ .ConfirmationURL }}</code></p><hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"><p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0;">This link expires in 24 hours. If you didn\'t request this change, please contact support immediately.</p></td></tr></table></div></body></html>`,

      mailer_subjects_password_changed_notification: '🔐 Your Password Has Been Changed',
      mailer_templates_password_changed_notification_content: `<html><body style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f9fafb; margin: 0; padding: 0;"><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><table width="100%" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);"><tr><td style="padding: 40px 20px; text-align: center;"><div style="margin-bottom: 30px;"><img src="https://prism.fractionfoundry.com/assets/prism_logo.png" alt="Prism Focus" style="height: 60px; width: auto;"></div><h1 style="color: #111827; font-size: 28px; font-weight: bold; margin: 0 0 20px 0;">Password Changed</h1><p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">This is a confirmation that the password for your Prism Focus account ({{ .Email }}) has been successfully changed.</p><p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">If you didn't make this change, please contact support immediately to secure your account.</p><hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"><p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0;">Questions? Contact support at support@fractionfoundry.com</p></td></tr></table></div></body></html>`,

      mailer_notifications_password_changed_enabled: true,
      mailer_notifications_email_changed_enabled: true,

      mailer_subjects_email_changed_notification: '📧 Your Email Address Has Been Changed',
      mailer_templates_email_changed_notification_content: `<html><body style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f9fafb; margin: 0; padding: 0;"><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><table width="100%" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);"><tr><td style="padding: 40px 20px; text-align: center;"><div style="margin-bottom: 30px;"><img src="https://prism.fractionfoundry.com/assets/prism_logo.png" alt="Prism Focus" style="height: 60px; width: auto;"></div><h1 style="color: #111827; font-size: 28px; font-weight: bold; margin: 0 0 20px 0;">Email Address Changed</h1><p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">The email address for your Prism Focus account has been changed from <strong>{{ .OldEmail }}</strong> to <strong>{{ .Email }}</strong>.</p><p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">If you didn't make this change, please contact support immediately to secure your account.</p><hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"><p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0;">Questions? Contact support at support@fractionfoundry.com</p></td></tr></table></div></body></html>`
    };

    const response = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailTemplates)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Failed to update email templates');
      console.error('Error:', error.message || error);
      rl.close();
      process.exit(1);
    }

    console.log('✅ Email templates updated successfully!');
    console.log('');
    console.log('Your Prism Focus emails now feature:');
    console.log('  🎨 Professional branding with the Prism logo');
    console.log('  🎯 Centered, responsive design');
    console.log('  🌈 Gradient buttons matching your brand colors');
    console.log('  ✨ Clear, friendly copy');
    console.log('');
    console.log('All authentication emails will now use these templates!');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
});
