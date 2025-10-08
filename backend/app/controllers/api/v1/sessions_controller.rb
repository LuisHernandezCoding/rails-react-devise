# frozen_string_literal: true

module Api
  module V1
    class SessionsController < ApplicationController
      # POST /api/v1/sign_in
      def create
        user = User.find_for_database_authentication(email: params.dig(:user, :email))

        if user&.valid_password?(params.dig(:user, :password))
          sign_in(user)
          render json: { user: { id: user.id, email: user.email } }, status: :ok
        else
          render json: { errors: ["Invalid email or password"] }, status: :unauthorized
        end
      end

      # DELETE /api/v1/sign_out
      def destroy
        sign_out(current_user)
        head :no_content
      end
    end
  end
end
