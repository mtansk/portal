<?php

namespace Mtansk\Cp\Repositories\Users;

use Mtansk\Cp\Routes\Router;
use Mtansk\Cp\Helpers\DB\GETQueryNew;
use Mtansk\Cp\Helpers\DB\PUTQueryNew;
use Mtansk\Cp\Models\Users\UserModel;
use Mtansk\Cp\Helpers\DB\POSTQueryNew;
use Mtansk\Cp\Helpers\DB\DELETEQueryNew;
use Mtansk\Cp\Helpers\Response\Response;
use Mtansk\Cp\Helpers\SearchParams\SearchParams;

class UserRepository
{
	public function __construct()
	{
	}

	public function findAll(?SearchParams $searchParams = null)
	{
		$user = Router::getInstance()->user;

		$sql = "SELECT 
	
			users.user_id,
    		users.first_name,
    		users.last_name,
    		users.middle_name,
    		users.user_title,
    		users.user_email,
    		users.user_phone,
    		users.user_telegram,
    		users.access_level,
    		users.account_status,
    		users.account_id,
    		users.created_at,
    		users.deleted_at,
    		users.company_id,
    		users.department_id,

			departments.department_name,
			departments.department_color,

			auth.invites.invite_id,
			auth.invites.invite_code,
			auth.invites.expires_at

        	FROM users
        	LEFT JOIN departments ON users.department_id = departments.department_id

        	LEFT JOIN auth.invites ON users.user_id = auth.invites.user_id 
        		AND auth.invites.expires_at > NOW() 
        		AND auth.invites.company_id = users.company_id 

        	WHERE users.company_id=:company_id ";

		$bindings = [
			":company_id" => $user["company_id"],
		];

		$get = new GETQueryNew($sql, $bindings, "main", "users", "user", );
		$get->searchParams = $searchParams;
		$get->afterQuery = " ORDER BY users.last_name ASC";


		$data = $get->execute();
		return $data;
	}
	public function findById(string $user_id)
	{
		$sql = "SELECT 
	
			users.user_id,
    		users.first_name,
    		users.last_name,
    		users.middle_name,
    		users.user_title,
    		users.user_email,
    		users.user_phone,
    		users.user_telegram,
    		users.access_level,
    		users.account_status,
    		users.account_id,
    		users.created_at,
    		users.deleted_at,
    		users.company_id,
    		users.department_id,

			departments.department_name,
			departments.department_color,

			auth.invites.invite_id,
			auth.invites.invite_code,
			auth.invites.expires_at

        	FROM users
        	LEFT JOIN departments ON users.department_id = departments.department_id

        	LEFT JOIN auth.invites ON users.user_id = auth.invites.user_id 
        		AND auth.invites.expires_at > NOW() 
        		AND auth.invites.company_id = users.company_id 

        	WHERE users.user_id=:user_id";

		$bindings = [
			":user_id" => $user_id,
		];

		$get = new GETQueryNew($sql, $bindings, "main", "users", "user");

		$data = $get->execute();
		return $data[0] ?? null;
	}

	public function findAllByAccountIdForSelection(string $account_id)
	{
		$sql = "SELECT 
        
			main.users.user_id,
			main.users.account_id,
			main.users.user_title,
			main.users.deleted_at,
			main.users.company_id,

			main.companies.company_name

			FROM main.users 

				LEFT JOIN main.companies 
				ON main.users.company_id = main.companies.company_id

			WHERE main.users.account_id = :account_id";

		$bindings = [
			":account_id" => $account_id
		];

		$get = new GETQueryNew($sql, $bindings);
		$data = $get->execute();

		return $data;
	}

	public function update(UserModel $userModel, string $user_id)
	{
		$user = Router::getInstance()->user;

		$sql = "UPDATE users 
		SET 
			last_name = :last_name,
			first_name = :first_name,
			middle_name = :middle_name,
			user_title = :user_title,
			department_id = :department_id,
			user_email = :user_email,
			user_phone = :user_phone,
			user_telegram = :user_telegram
		WHERE user_id = :user_id
		AND company_id = :company_id";

		$bindings = [
			":user_id" => $user_id,
			":last_name" => $userModel->last_name,
			":first_name" => $userModel->first_name,
			":middle_name" => $userModel->middle_name,
			":user_title" => $userModel->user_title,
			":department_id" => $userModel->department_id,
			":user_email" => $userModel->user_email,
			":user_phone" => $userModel->user_phone,
			":user_telegram" => $userModel->user_telegram,
			":company_id" => $user["company_id"]
		];

		$put = new PUTQueryNew($sql, $bindings);
		$res = $put->execute();

		return $res;
	}
	public function create(array $rows)
	{
		$sql = "INSERT INTO users(
				    user_id,
				    first_name,
				    last_name,
				    middle_name,
				    user_title,
				    user_email,
				    user_phone,
				    user_telegram,
				    access_level,
				    account_status,
				    account_id,
				    company_id,
				    department_id
				)
				VALUES ";

		$post = new POSTQueryNew($sql);
		$res = $post->executeWithRows($rows);
		return $res;
	}


	public function findMy()
	{
		$user = Router::getInstance()->user;

		$sql = "SELECT 
	
		users.user_id,
		users.first_name,
		users.last_name,
		users.middle_name,
		users.user_title,
		users.user_email,
		users.user_phone,
		users.user_telegram,
		users.access_level,
		users.account_status,
		users.account_id,
		users.created_at,
		users.deleted_at,
		users.company_id,
		users.department_id,

		departments.department_name,
		departments.department_color,

		companies.company_name

		FROM users
		LEFT JOIN departments ON users.department_id = departments.department_id
		LEFT JOIN companies ON users.company_id = companies.company_id

		WHERE users.account_id=:account_id";

		$bindings = [
			":account_id" => $user["account_id"],
		];

		$get = new GETQueryNew($sql, $bindings);
		$data = $get->execute();

		return $data;
	}

	public function findMyColleagues()
	{
		$user = Router::getInstance()->user;

		$sql = "SELECT 
	
			users.user_id,
    		users.first_name,
    		users.last_name,
    		users.middle_name,
    		users.user_title,
    		users.user_email,
    		users.user_phone,
    		users.user_telegram,
    		users.access_level,
			users.created_at,
    		users.deleted_at,
    		users.company_id,
    		users.department_id,

			departments.department_name,
			departments.department_color

        	FROM users
        		LEFT JOIN departments ON users.department_id = departments.department_id

        	WHERE users.company_id=:company_id 
			AND users.deleted_at IS NULL ";

		$bindings = [
			":company_id" => $user["company_id"],
		];

		$get = new GETQueryNew($sql, $bindings, "main", "users", "user");
		$get->afterQuery = " ORDER BY users.last_name ASC";

		$data = $get->execute();
		return $data;
	}

	public function suspendUser(string $userId)
	{
		$user = Router::getInstance()->user;
		if ($user["user_id"] === $userId) {
			$response = new Response();
			$response->code = 403;
			$response->send();
		}
		$sql = "UPDATE users

		LEFT JOIN auth.root_users ON users.user_id = root_users.user_id

		SET account_status = 'suspended',
		access_level = 'employee'

		WHERE users.user_id = :user_id
		AND users.company_id = :company_id 
		AND root_users.user_id IS NULL
		AND users.account_id IS NOT NULL";

		$bindings = [
			":user_id" => $userId,
			":company_id" => $user["company_id"]
		];

		$put = new PUTQueryNew($sql, $bindings);
		$res = $put->execute();

		return $res;
	}

	public function activateUser(string $userId, string $accountId)
	{
		$sql = "UPDATE main.users
                SET
                    account_id = :account_id,
                    access_level = 'employee',
                    account_status = 'active'
                WHERE
                    user_id = :user_id";

		$bindings = [
			":account_id" => $accountId,
			":user_id" => $userId
		];

		$put = new PUTQueryNew($sql, $bindings);
		$res = $put->execute();
		return $res;
	}

	public function deleteUser(string $user_id)
	{
		$user = Router::getInstance()->user;

		$sql = "UPDATE main.users

		LEFT JOIN auth.root_users ON users.user_id = root_users.user_id

		SET users.deleted_at = NOW(),
		account_status = CASE WHEN account_id IS NOT NULL THEN 'suspended' ELSE NULL END,
		access_level = CASE WHEN account_id IS NOT NULL THEN 'employee' ELSE NULL END

		WHERE users.user_id = :user_id
		AND users.company_id = :company_id
		AND root_users.user_id IS NULL ";

		$bindings = [
			":user_id" => $user_id,
			":company_id" => $user["company_id"]
		];

		$put = new PUTQueryNew($sql, $bindings);
		$res = $put->execute();

		return $res;
	}

	public function recoverUser(string $userId)
	{
		$user = Router::getInstance()->user;

		$sql = "UPDATE main.users
		SET deleted_at = NULL
		WHERE user_id = :user_id
		AND company_id = :company_id";

		$bindings = [
			":user_id" => $userId,
			":company_id" => $user["company_id"]
		];

		$put = new PUTQueryNew($sql, $bindings);
		$res = $put->execute();

		return $res;
	}

	public function updateAccessLevel(string $userId, string $accessLevel)
	{
		$user = Router::getInstance()->user;

		$sql = "UPDATE main.users
					LEFT JOIN auth.root_users ON users.user_id = root_users.user_id
					SET access_level = :access_level
				WHERE users.user_id = :user_id
				AND users.company_id = :company_id
				AND root_users.user_id IS NULL ";

		$bindings = [
			":user_id" => $userId,
			":access_level" => $accessLevel,
			":company_id" => $user["company_id"]
		];

		$put = new PUTQueryNew($sql, $bindings);
		$res = $put->execute();

		return $res;
	}


	public function insertMockUserId(string $userId, string $companyId)
	{
		$sql = "INSERT INTO auth.mock_users
		(user_id, company_id) VALUES ";

		$rows = [
			[
				":user_id" => $userId,
				":company_id" => $companyId
			]
		];

		$post = new POSTQueryNew($sql);
		$res = $post->executeWithRows($rows);

		return $res;
	}

	public function deleteMockUsersData()
	{
		$user = Router::getInstance()->user;
		$sql = "DELETE main.users
				FROM main.users
					LEFT JOIN auth.mock_users ON users.user_id = mock_users.user_id
				WHERE mock_users.company_id = :company_id ";

		$bindings = [
			":company_id" => $user["company_id"]
		];

		$delete = new DELETEQueryNew($sql, $bindings);
		$res = $delete->execute();

		return $res;
	}
}