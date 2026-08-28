<?php
namespace Mtansk\Cp\Helpers\Other;

use DateTime;
use Exception;
use Mtansk\Cp\Helpers\Response\Response;

class Filter
{
	public array $array;
	private string $key;

	private ?Response $response = null;

	public function __construct(array $array)
	{
		$this->array = $array;

		$this->response = new Response();
	}

	private static $options = [
		"required",
		"type",

		"maxLength",
		"allowedValues",

		"maxValue",
		"minValue",
		"maxFraction",

		"nullOnEmpty",
	];

	private static $presets = [
		"name" => [
			"type" => "string",
			"maxLength" => 100,
			"required" => true,
		],
		"desc" => [
			"type" => "string",
			"maxLength" => 255,
		],



		"rate" => [
			"type" => "float",
			"required" => true,
			"minValue" => 0,
			"maxValue" => 1_000_000, // 11, 4
			"maxFraction" => 4,
		],
		"qty" => [
			"type" => "float",
			"required" => true,
			"minValue" => 0,
			"maxValue" => 100_000_000,  // 13, 4
			"maxFraction" => 4,
		],
		"total" => [
			"type" => "float",
			"required" => true,
			"minValue" => 0,
			"maxValue" => 1_000_000, // 9, 2
			"maxFraction" => 2,
		],
		"percent" => [
			"type" => "float",
			"required" => true,
			"minValue" => 0,
			"maxValue" => 1, // 5, 4   0,01    10,25% = 0,1025    2,55% = 0,0255 
			"maxFraction" => 4,
		],


		"date" => [
			"type" => "date",
			"required" => true,
		],
		"time" => [
			"type" => "time",
			"required" => true,
		],

		"bool" => [
			"required" => true,
			"allowedValues" => [0, 1, "0", "1"],
		],

		"nullableId" => [
			"nullOnEmpty" => true,
		],
		"password" => [
			"required" => true,
			"maxLength" => 100,
			"type" => "password"
		],
		"first_name" => [
			"required" => true,
			"maxLength" => 30,
			"type" => "string"
		],
		"telegram" => [
			"maxLength" => 30,
			"type" => "string",
			"required" => false,
		],

	];

	public function validate(string $key, string $presetKey)
	{
		$preset = self::$presets[$presetKey] ?? null;
		if (!$preset) {
			$this->response->code = 500;
			$this->response->error_code = "FILTER-PRESET";
			$this->response->send();
		}

		return $this->validateWithCustomOptions($key, $preset);
	}

	public function validateWithCustomOptions(string $key, array $options)
	{
		$type = $options["type"] ?? null;
		$required = $options["required"] ?? false;
		$maxLength = $options["maxLength"] ?? null;
		$allowedValues = $options["allowedValues"] ?? null;
		$maxValue = $options["maxValue"] ?? null;
		$minValue = $options["minValue"] ?? null;
		$maxFraction = $options["maxFraction"] ?? null;
		$nullOnEmpty = $options["nullOnEmpty"] ?? false;


		$this->key = $key;

		$value = $this->array[$key] ?? null;
		($value !== "" && $value !== null) && $value = trim($value);
		($value === "" || $value === null) && $nullOnEmpty && $value = null;

		$required && $this->requiredGuard($value, $required);
		$type && $this->typeGuard($value, $type);
		$maxLength && $this->maxLengthGuard($value, $maxLength);
		$allowedValues && $this->allowedValuesGuard($value, $allowedValues);
		$maxValue && $this->maxValueGuard($value, $maxValue);
		$minValue && $this->minValueGuard($value, $minValue);
		$maxFraction && $this->maxFractionGuard($value, $maxFraction);

		return $value;
	}



	private function typeGuard(mixed $value, string $type)
	{
		if ($type === "float") {
			if (!is_numeric($value) && $value !== null && $value !== "") {
				$this->response->code = 422;
				$this->response->error_code = "FILTER-FLOAT";
				$this->response->message = "Invalid float {$this->key}";
				$this->response->send();
			}
		}

		if ($type === "date") {
			if (!$this->validateDate($value) && $value !== null) {
				$this->response->code = 422;
				$this->response->error_code = "FILTER-DATE";
				$this->response->message = "Invalid date {$this->key}";
				$this->response->send();
			}
		}

		if ($type === "time") {
			if (!$this->validateTime($value) && $value !== null) {
				$this->response->code = 422;
				$this->response->error_code = "FILTER-TIME";
				$this->response->message = "Invalid time {$this->key}";
				$this->response->send();
			}
		}

		if ($type === "email") {
			if ($value !== null && $value !== "" && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
				$this->response->code = 422;
				$this->response->error_code = "FILTER-EMAIL";
				$this->response->message = "Invalid email {$this->key}";
				$this->response->send();
			}
		}

		if ($type === "password") {
			if ($value !== null && $value !== "" && !preg_match('/^[\x20-\x7E]{8,}$/', $value)) {
				$this->response->code = 422;
				$this->response->error_code = "FILTER-PASSWORD";
				$this->response->message = "Invalid password {$this->key}";
				$this->response->send();
			}
		}
	}
	private function requiredGuard(mixed $value, bool $required)
	{
		if ($required && ($value === null || $value === "")) {
			$this->response->code = 422;
			$this->response->error_code = "FILTER-REQUIRED";
			$this->response->message = "Need data for {$this->key}";
			$this->response->send();
		}
	}
	private function maxLengthGuard(mixed $value, int $maxLength)
	{
		if (is_string($value) && mb_strlen($value) > $maxLength) {
			$this->response->code = 422;
			$this->response->error_code = "FILTER-LENGTH-MAX";
			$this->response->message = "Max length exceeded for {$this->key}";
			$this->response->send();
		}
	}
	private function allowedValuesGuard(mixed $value, array $allowedValues)
	{
		if (!in_array($value, $allowedValues)) {
			$this->response->code = 422;
			$this->response->error_code = "FILTER-ALLOWED-VALUES";
			$this->response->message = "Value is not allowed for {$this->key}";
			$this->response->send();
		}
	}
	private function maxValueGuard(mixed $value, float $maxValue)
	{
		if (!is_numeric($value)) {
			return;
		}

		if ($value > $maxValue) {
			$this->response->code = 422;
			$this->response->error_code = "FILTER-VALUE-MAX";
			$this->response->message = "Value is too big for {$this->key}. Value is {$value}";
			$this->response->send();
		}
	}
	private function minValueGuard(mixed $value, float $minValue)
	{
		if (!is_numeric($value)) {
			return;
		}

		if ($value < $minValue) {
			$this->response->code = 422;
			$this->response->error_code = "FILTER-VALUE-MIN";
			$this->response->message = "Value is too small for {$this->key}";
			$this->response->send();
		}
	}
	private function maxFractionGuard(mixed $value, int $maxFraction)
	{
		if (!is_numeric($value)) {
			return;
		}

		$parts = explode(".", $value);
		$fraction = $parts[1] ?? null;

		if ($fraction && mb_strlen($fraction) > $maxFraction) {
			$this->response->code = 422;
			$this->response->error_code = "FILTER-VALUE-FRACTION";
			$this->response->message = "Too many fractions for {$this->key}";
			$this->response->send();
		}
	}

	public function filterIds($key)
	{
		$ids = $this->array[$key] ?? null;

		if (!is_array($ids) || empty($ids)) {
			$this->response->code = 500;
			$this->response->error_code = "FILTER-IDS-INVALID";
			$this->response->message = "Wrong ids";
			$this->response->send();
		}


		$filteredIds = [];
		foreach ($ids as $id => $dates) {
			$filteredId = $id;

			if (!is_array($dates)) {
				$this->response->code = 500;
				$this->response->error_code = "FILTER-IDS-DATES";
				$this->response->message = "Wrong dates";
				$this->response->send();
			}

			foreach ($dates as $date) {
				if (!$this->validateDate($date)) {
					$this->response->code = 422;
					$this->response->error_code = "FILTER-DATE";
					$this->response->message = "Invalid date {$date}";
					$this->response->send();
				}

				$filteredIds[$filteredId][] = $date;
			}
		}
		return $filteredIds;
	}

	public static function validateTotal(mixed $rate, mixed $qty, float $max = 1_000_000): float
	{
		if ($rate === null || $qty === null) {
			$res = new Response();
			$res->code = 422;
			$res->error_code = "FILTER-TOTAL-NULL";
			$res->message = "Rate and quantity must not be null.";
			$res->send();
		}

		if (!is_numeric($rate)) {
			$res = new Response();
			$res->code = 422;
			$res->error_code = "FILTER-RATE-NUMBER";
			$res->message = "Rate must be a valid number.";
			$res->send();
		}

		if (!is_numeric($qty)) {
			$res = new Response();
			$res->code = 422;
			$res->error_code = "FILTER-TOTAL-QTY";
			$res->message = "Quantity must be a valid number.";
			$res->send();
		}

		$_rate = (float) $rate;
		$_qty = (float) $qty;

		if ($_rate < 0) {
			$res = new Response();
			$res->code = 422;
			$res->error_code = "FILTER-TOTAL-RATE";
			$res->message = "Rate must not be negative.";
			$res->send();
		}

		$total = $_rate * $_qty;

		if ($total < 0 || $total > $max) {
			$res = new Response();
			$res->code = 422;
			$res->error_code = "FILTER-TOTAL-RANGE";
			$res->message = "Total must be between 0 and {$max}.";
			$res->send();
		}

		return $total;
	}

	public static function validateSheetDur(
		int $start,
		int $end,
		int $break,
		int $plusDay
	) {
		$dur = $end - $start - $break + ($plusDay ? 24 * 60 * 60 : 0);

		if ($dur < 0) {
			$res = new Response();
			$res->code = 422;
			$res->error_code = "FILTER-SHEET-DUR";
			$res->message = "Invalid sheet duration.";
			$res->send();
		}

		return $dur;
	}
	public static function validateDate($date)
	{
		try {
			$date = explode("-", $date);
			if (count($date) != 3) {
				return false;
			}
			if (
				!is_numeric($date[0]) ||
				!is_numeric($date[1]) ||
				!is_numeric($date[2])
			) {
				return false;
			}
			if (!checkdate($date[1], $date[2], $date[0])) {
				return false;
			}
			return true;
		} catch (Exception $e) {
			return false;
		}
	}
	public static function validateTime($timeInSeconds)
	{
		try {
			// Проверка на нечисловое значение
			if (!is_numeric($timeInSeconds)) {
				return false;
			}

			// Преобразуем секунды в часы, минуты и секунды
			$hours = floor($timeInSeconds / 3600);
			$minutes = floor(($timeInSeconds % 3600) / 60);
			$seconds = $timeInSeconds % 60;

			// Проверка на диапазон и кратность
			if (
				$timeInSeconds < 0 ||
				$timeInSeconds > 86400 || // 24 часа = 86400 секунд
				$seconds !== 0 || // Проверка на остаток секунд
				$minutes % 1 !== 0 || // Проверка кратности минут
				$hours % 1 !== 0 // Проверка кратности часов
			) {
				return false;
			}

			return true;
		} catch (Exception $e) {
			return false;
		}
	}
	public static function isBefore(string $isThisDateBefore, string $thanThisDate, bool $inclusive = false)
	{
		$firstDate = new DateTime($isThisDateBefore);
		$secondDate = new DateTime($thanThisDate);

		if ($inclusive) {
			$res = $firstDate <= $secondDate;
		} else {
			$res = $firstDate < $secondDate;
		}


		if (!$res) {
			$res = new Response();
			$res->code = 422;
			$res->error_code = "FILTER-DATE";
			$res->message = "First date must be before second date.";
			$res->send();
		}
	}

}
