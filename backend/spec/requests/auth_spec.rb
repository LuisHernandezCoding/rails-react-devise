# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Auth", type: :request do
  describe "POST /api/v1/sign_up" do
    context "with valid params" do
      it "creates a user and returns created status" do
        params = {
          user: {
            email: "new_user@example.com",
            password: "password",
            password_confirmation: "password"
          }
        }

        post "/api/v1/sign_up", params: params

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json.dig("user", "email")).to eq("new_user@example.com")
      end
    end

    context "with invalid params" do
      it "returns unprocessable_entity and errors" do
        params = { user: { email: "", password: "short", password_confirmation: "nope" } }

        post "/api/v1/sign_up", params: params

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["errors"]).to be_an(Array)
      end
    end
  end

  describe "POST /api/v1/sign_in" do
    let!(:user) do
      create(:user, email: "login_user@example.com", password: "password",
                    password_confirmation: "password")
    end

    context "with valid credentials" do
      it "signs in and returns user data" do
        params = { user: { email: "login_user@example.com", password: "password" } }

        post "/api/v1/sign_in", params: params

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json.dig("user", "email")).to eq("login_user@example.com")
      end
    end

    context "with invalid credentials" do
      it "returns unauthorized and error message" do
        params = { user: { email: "login_user@example.com", password: "wrong" } }

        post "/api/v1/sign_in", params: params

        expect(response).to have_http_status(:unauthorized)
        json = JSON.parse(response.body)
        expect(json["errors"]).to include("Invalid email or password")
      end
    end
  end

  describe "GET /api/v1/me and DELETE /api/v1/sign_out" do
    let(:user) { create(:user) }

    it "returns current user when signed in and signs out successfully" do
      # sign in
      post "/api/v1/sign_in", params: { user: { email: user.email, password: user.password } }
      expect(response).to have_http_status(:ok)

      # try to pick up an Authorization header (devise-jwt); otherwise rely on
      # rack-test to preserve cookie-based session between requests
      auth_header = response.headers["Authorization"]

      # get current user (request JSON to avoid Devise redirect behavior)
      if auth_header.present?
        get "/api/v1/me", headers: { "Authorization" => auth_header, "Accept" => "application/json" }
      else
        get "/api/v1/me", headers: { "Accept" => "application/json" }
      end
    expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.dig("user", "email")).to eq(user.email)

      # sign out
      if auth_header.present?
        delete "/api/v1/sign_out", headers: { "Authorization" => auth_header, "Accept" => "application/json" }
      else
        delete "/api/v1/sign_out", headers: { "Accept" => "application/json" }
      end
      expect(response).to have_http_status(:no_content)

      # subsequent /me should be unauthorized
      get "/api/v1/me", headers: { "Accept" => "application/json" }
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
