/**
 * 
 */
package com.eccom.todo.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.eccom.todo.dao.ScheduleDao;

/**
 * @author alex
 *
 */
@Repository
public class ScheduleDaoImpl implements ScheduleDao {

	private final DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
	
	public DataSource dataSource;
	private JdbcTemplate jdbcTemplate;
	
	public DataSource getDataSource() {
		return dataSource;
	}
	
	@Autowired
	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
		this.jdbcTemplate = new JdbcTemplate(dataSource);
		
	}

	@SuppressWarnings("unchecked")
	@Override
	public Map<String, Object> findOne(int id) {
		String sql = "select s.*,u.name as name,u.mail,cu.name as createuser,p.name as pname " +
				"from schedule s left join user u on s.user_id=u.id " +
				"left join user cu on s.createby=cu.id " +
				"left join project p on s.project_id=p.id where s.id=?";
		RowMapper<Map<String, Object>> mapper = new RowMapper<Map<String,Object>>() {

			@Override
			public Map<String, Object> mapRow(ResultSet res, int row)
					throws SQLException {
				Map<String,Object> map = new HashMap<String, Object>();
				int addrType = res.getInt("addr");
				if(addrType == 0) {
					map.put("addr","现场");
				}
				else {
					map.put("addr","公司");
				}
				map.put("project", res.getString("pname"));
				map.put("id",res.getInt("id"));
				map.put("subject",res.getString("subject"));
				map.put("createby",res.getString("createuser"));
				long ts = res.getLong("entrytime");
				map.put("createtime",format.format(new Date(ts)));
				map.put("desc",res.getString("desc"));
				map.put("user",res.getString("name"));
				map.put("mail",res.getString("mail"));
				int mode = res.getInt("mode");
				// full day
				StringBuffer sb = new StringBuffer();
				if(mode == 1) {
					sb.append(res.getString("startdate").substring(0, 5)).append("("+"09:00"+")");
					sb.append(" - ");
					sb.append(res.getString("enddate").substring(0, 5)).append("("+"17:00"+")");
				}
				else {
					int timeType = res.getInt("starttime");
					sb.append(res.getString("startdate").substring(0, 5)).append("("+getTime(timeType)+")");
					sb.append(" - ");
					timeType = res.getInt("endtime");
					sb.append(res.getString("enddate").substring(0, 5)).append("("+getTime(timeType)+")");
				}
				map.put("time",sb.toString());
				return map;
			}
			
		};
		@SuppressWarnings("rawtypes")
		List list = jdbcTemplate.query(sql, new Object[]{id}, mapper);
		if(list != null && list.size()>0) {
			return (Map<String, Object>) list.get(0);
		} 
		else {
			return null;
		}
	}
	
	private String getTime(int type) {
		switch(type) {
			case 0:
				return "09:00";
			case 1:
				return "12:00";
			case 2:
				return "17:00";
			case 3:
				return "21:00";
			default:
				return "00:00";
		}
	}

}
